'use strict';

function ConfigurationManager(isDebug)
{
	let self = this;
	self.listener = new SBListener();
	self.on = self.listener.on;
	self.emit = self.listener.emit;

	//the ID of the currently selected configuration
	self.currentConfiguration = -1;

	//the name of the currently selected configuration
	self.currentConfigurationName = '';

	//all the configurations saved for this calibration system
	self.configurations = [];
	self.configurationSettings = [];
	self.deviceList = [];
	self.referenceList = [];
	self.controlList = [];
	self.dataPoints = [];
	self.settings = [];

	//for database calls
	self.isDebug = isDebug === true;

	//for logging transactions
	self.userName = '';
	self.pcName = '';
	self.applicationName = '';

	/**
	 * Recalls a list of configurations that have been stored in teh database
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&connection=calibration&storedProcedure=RecallConfigurations&systemID=35
	 * Function Type: Async
	 * 
	 * @param {integer} systemID = ID number of the system from the database
	 */
	self.recallConfigurations = function(systemID)
	{
		try
		{
			//if the ID is not a positive integer, this is a problem
			//This function lives in sbGlobal
			if(isPositiveInteger(systemID) === false)
			{
				throw new RangeError('Invalid System ID. Has the system name been set?');
			}

			//build the database call
			let parameters = 
			{
				debug: self.isDebug,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'RecallConfigurations',
				systemID: systemID
			};

			//log the parameters
			self.logDebug('recallConfigurations', 'parameters', parameters);

			//database call
			ProcessDatabaseRequest(parameters, function(data)
			{
				//process the retrieved data
				self.processConfigurations(data);
			})
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * For processing configurations retrieved by the recallConfigurations function
	 * Funtion Type: Sync
	 * 
	 * @param {string} data - JSON object to be processed
	 * @returns {boolean} - if the processing of retrieved data was successful
	 */
	self.processConfigurations = function(data)
	{
		try
		{
			//This function is in sbGlobal
			if(isJson(data))
			{
				//store the configurations for later use
				self.configurations = JSON.parse(data);

				//find the current configuration
				//there might not be one
				let currentConfig = self.configurations.filter(function(config)
				{
					return parseInt(config.CurrentConfiguration) === 1;
				});

				//if there is a current configuration
				//store the ID and name for later use
				if(currentConfig.length > 0)
				{
					self.currentConfiguration = currentConfig[0].ConfigurationID;
					self.currentConfigurationName = currentConfig[0].ConfigurationName;
				}

				//notify the outside world that processing has happened
				self.emit('configurationsProcessed', self.configurations);
				self.logDebug('configurationsProcessed', 'Configurations processed successfully', data);
				return true;
			}

			self.processDatabaseError(data);
			return false;
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Creates a new, blank, named configuration in the database
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&username=mvorkapich&pcname=1234&applicationname=CalRun&connection=calibration&storedProcedure=CreateNewConfiguration&systemID=35&configurationName=blargyblarg
	 * Function Type: Async
	 */
	self.createNewConfiguration = function(systemID, configurationName)
	{
		try
		{
			//system ID must be a positive integer
			if(isPositiveInteger(systemID) === false)
			{
				throw new RangeError('Invalid System ID. Has the system name been set?');
			}

			//the configuration name must exist
			if(!configurationName)
			{
				throw new RangeError('Configuration name cannot be blank.');
			}

			//the configuration name cannot already be in use
			if(self.checkExistingConfiguration(configurationName) === true)
			{
				throw new Error('Configuration name already in use, please select a different name.');
			}

			//define the parameters for submitting to the database
			let parameters = 
			{
				debug: self.isDebug,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'CreateNewConfiguration',
				systemID: systemID,
				configurationName: configurationName,
			};

			//this is for using the transaction log
			if(self.userName && self.pcName && self.applicationName)
			{
				parameters.applicationName = self.applicationName;
				parameters.username = self.userName;
				parameters.pcname = self.pcName;
			}

			//log the debug output
			self.logDebug('createNewConfiguration', 'parameters', parameters);

			//process the database request
			ProcessDatabaseRequest(parameters, function(data)
			{
				self.processNewConfiguration(data);
			});
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * When a new configuration has been created, this gets called
	 * Puts the configuration into the configuration list and clears out the settings
	 * Function Type: Sync
	 * 
	 * Example of good JSON reply: 
	 * [{"newConfigurationID":"999","calibrationSystemID":"35","configurationName":"my special new configuration"}]
	 * 
	 * @param {string} data - JSON encoded string
	 * @returns {boolean} - was the configuration created successfully?
	 */
	self.processNewConfiguration = function(data)
	{
		try
		{
			//response must be JSON
			//This function lives in sbGlobal
			if(isJson(data))
			{
				//parse response
				let reply = JSON.parse(data);

				//if the database reply is an empty JSON object
				//This is a problem 
				//Empty JSON object would be [] with nothing between
				//This will pass the JSON check
				if(reply.length === 0)
				{
					throw new Error('Database error! New configuration failed!');
				}

				//get the new configuration ID
				let configurationID = parseInt(reply[0].newConfigurationID);

				//clear the settings
				self.configurationSettings = [];

				//add a new configuration to the list of configurations
				self.addConfiguration(reply[0].calibrationSystemID, configurationID, reply[0].configurationName);

				//set the current configuration ID
				self.currentConfiguration = configurationID;

				//set the current configuration name
				self.currentConfigurationName = reply[0].configurationName;

				//trigger the listener
				self.emit('newConfigurationProcessed', configurationID);

				//log debug
				self.logDebug('processNewConfiguration', 'Configuration created successfully', data);
				return true;
			}

			//if this gets called, then clearly there is an error condition
			self.processDatabaseError(data);
			return false;
			
		}
		catch(err)
		{
			self.onError(err);
		}
	}

	/**
	 * Adds a configuration to the configuration list. This is really intended for internal use only
	 * This sets the new configuration as the current configuration
	 * Function Type: Sync
	 * 
	 * @param {integer} systemID - ID of the system
	 * @param {integer} configurationID - ID of the new configuration
	 * @param {string} configurationName - The name of the new configuration
	 * @param {string} notes - (Optional) any notes associated with the new configuration
	 */
	self.addConfiguration = function(systemID, configurationID, configurationName, notes = null)
	{
		try
		{
			//NOTE: For these checks, it should not be possible to get here with any of these
			//situations being true since most of these should have been checked elsewhere
			//systemID and configurationID must be positive integers
			//isPositiveInteger is in sbGlobal
			if(isPositiveInteger(systemID) === false || isPositiveInteger(configurationID) === false)
			{
				throw new RangeError('System ID and/or Configuration ID are invalid. System ID = ' + systemID + ', Configuration ID = ' + configurationID);
			}

			//configuration name can't be blank
			if(!configurationName)
			{
				throw new RangeError('Configuration Name cannot be blank');
			}

			//configuration name cannot already exist
			if(self.checkExistingConfiguration(configurationName) === true)
			{
				throw new Error('Configuration Name already in use. ')
			}

			//sets all configurations as not being current
			for(let i = 0; i < self.configurations.length; i++)
			{
				self.configurations[i].CurrentConfiguration = 0;
			}

			self.logDebug('addConfiguration', 'Set all configurations to not current.');

			//create a new configuration object with the new information
			//this one should be current
			let newConfiguration = 
			{
				ConfigurationID: configurationID,
				ConfigurationName: configurationName,
				CalibrationSystemID: systemID,
				CurrentConfiguration: 1,
				Notes: notes
			};

			self.logDebug('addConfiguration', 'new configuration', newConfiguration);

			//add the new configuration to the list
			self.configurations.push(newConfiguration);

			self.logDebug('addConfiguration', 'new configuration added to configuration list', self.configurations);

			return true;
		}
		catch(err)
		{
			self.onError(err);
			return false;
		}
	};

	/**
	 * Renames an existing configuration
	 * Test URL:
	 * http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&username=mvorkapich&pcname=1234&applicationname=CalRun&connection=calibration&storedProcedure=RenameConfiguration&configurationID=71&newName=cowabunga
	 * Function Type: Async
	 * 
	 * @param {integer} configurationID - must be an existing configuration
	 * @param {string} configurationName - The name to assign to the configuration
	 */
	self.renameConfiguration = function(configurationID, configurationName)
	{
		try
		{
			//isPositiveInteger is in sbGlobal
			//value must be a positive integer
			if(isPositiveInteger(configurationID) === false)
			{
				throw new RangeError('Configuration ID is invalid. Configuration ID = ' + configurationID);
			}

			//configuration name can't be blank
			if(!configurationName)
			{
				throw new RangeError('Configuration Name cannot be blank');
			}

			//configuration name cannot already exist
			if(self.checkExistingConfiguration(configurationName) === true)
			{
				throw new Error('Configuration Name already in use. ')
			}

			//configurationID must be in the list of configurations
			if(self.checkExistingConfigurationID(configurationID) === false)
			{
				throw new Error('Configuration ID ' + configurationID + ' cannot be found, please use a different configuration id.');
			}

			//Prepare the parameters that will be sent to the database
			let parameters = 
			{
				debug: self.isDebug,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'RenameConfiguration',
				configurationID: configurationID,
				newName: configurationName
			}

			//this is for using the transaction log
			if(self.userName && self.pcName && self.applicationName)
			{
				parameters.applicationName = self.applicationName;
				parameters.username = self.userName;
				parameters.pcname = self.pcName;
			}

			self.logDebug('renameConfiguration', 'parameters', parameters);

			ProcessDatabaseRequest(parameters, function(data)
			{
				self.processConfigurationRename(data);
			});

		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * When a configuration has been renamed, this gets called
	 * Updates the configuration name in the configuration list
	 * Function Type: Sync
	 * 
	 * @param {string} data - JSON encoded string
	 * @returns {boolean} returns true if the configuration was renamed successfully
	 */
	self.processConfigurationRename = function(data)
	{
		try
		{
			//An empty response from the database means the configuration could not be found in the database
			if(data === '[]')
			{
				throw new Error('Configuration not found in database');
			}

			//response must be valid JSON
			//isJson is from sbGlobal
			if(isJson(data))
			{
				//get the configuration information
				let configInfo = JSON.parse(data);
				let configID = parseInt(configInfo[0]['ConfigurationID']);
				let foundIt = false;

				//update the configuration information in local memory
				for(let i = 0; i < self.configurations.length; i++)
				{
					if(parseInt(self.configurations[i].ConfigurationID) === configID)
					{
						self.configurations[i].ConfigurationName = configInfo[0]['ConfigurationName'];
						foundIt = true;
						break;
					}
				}

				//if the configuration cannot be found, then this is an error
				if(!foundIt)
				{
					throw new Error('Unable to find configuration in local memory');
				}

				//notify the world about success
				self.emit('configurationRenamed', configInfo[0]);
				self.logDebug('processConfigurationRename', 'Configuration renamed successfully', configInfo[0]);
				return true;
			}

			//if data is not valid json then it's an error
			self.processDatabaseError(data);
			return false;
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Sets the specified configuration as current
	 * Test URL:
	 * http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&username=mvorkapich&pcname=1234&connection=calibration&storedProcedure=SetCurrentConfiguration&systemID=35&configurationID=35&applicationname=CalRun
	 * Function Type: Async
	 * 
	 * @param {integer} systemID - The ID of the calibration system
	 * @param {integer} configurationID - The ID of the configuration to set as current
	 */
	self.setCurrentConfiguration = function(systemID, configurationID)
	{
		try
		{
			if(isPositiveInteger(systemID) === false || isPositiveInteger(configurationID) === false)
			{
				throw new RangeError('System ID and/or Configuration ID are invalid. System ID = ' + systemID + ', Configuration ID = ' + configurationID);
			}

			if(self.checkExistingConfigurationID(configurationID) === false)
			{
				throw new Error('Configuration ID ' + configurationID + ' cannot be found, please use a different configuration id.');
			}
			let parameters = {
				debug: self.debugFlag,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'SetCurrentConfiguration',
				systemID: systemID,
				configurationID: configurationID,
			};

			//this is for using the transaction log
			if(self.userName && self.pcName && self.applicationName)
			{
				parameters.applicationName = self.applicationName;
				parameters.username = self.userName;
				parameters.pcname = self.pcName;
			}
			
			self.logDebug('setCurrentConfiguration', 'parameters', parameters);
	
			ProcessDatabaseRequest(parameters, function(data)
			{
				self.processSetCurrentConfiguration(data);
			});
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * When the selected configuration is set as the current one
	 * Updates the configuration list
	 * Sets the current configuration ID in the object
	 * Function Type: Sync
	 * 
	 * @param {string} data - JSON encoded string
	 */
	self.processSetCurrentConfiguration = function(data)
	{
		try
		{
			//a blank JSON object indicates configuration not in database
			if(data === '[]')
			{
				throw new Error('Configuration not found in database');
			}

			//must be a valid JSON object
			if(isJson(data))
			{
				//parse the object and set the IDs
				let configInfo = JSON.parse(data);
				let configID = parseInt(configInfo[0].ConfigurationID);
				self.currentConfiguration = configID;
				self.currentConfigurationName = configInfo[0].ConfigurationName;
				self.logDebug('processSetCurrentConfiguration', 'set current configuration ID', configID);

				//once the database is updated, need to update the local list with which one is current
				let foundIt = false;
				for(let i = 0; i < self.configurations.length; i++)
				{
					self.configurations[i].CurrentConfiguration = 0;
					if(parseInt(self.configurations[i].ConfigurationID) === configID)
					{
						self.configurations[i].CurrentConfiguration = 1;
						foundIt = true;
					}
				}
				//if the configuration cannot be found, then this is an error
				if(!foundIt)
				{
					throw new Error('Unable to find configuration in local memory');
				}

				self.logDebug('processSetCurrentConfiguration', 'updated configurations object', self.configurations);

				self.emit('configurationSetAsCurrent', configInfo[0]);
				
				return true;
			}

			//if the code makes it here, then it was not a valid JSON object
			//this is an error
			self.processDatabaseError(data);
			return false;


		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Creates a duplicate of a specified configuration so it can be used as a starting point for a new configuration
	 * Function Type: Async
	 * 
	 * @param {integer} systemID - the id of the system
	 * @param {integer} configurationID - the id of the configuration to be used
	 * @param {string} configurationName - the new name of the configuration
	 */
	self.copyConfiguration = function(systemID, configurationID, configurationName)
	{
		try
		{
			//system ID and configuration ID must be positive integers
			//isPositiveInteger is from sbGlobal
			if(isPositiveInteger(systemID) === false || isPositiveInteger(configurationID) === false)
			{
				throw new RangeError('System ID and/or Configuration ID are invalid. System ID = ' + systemID + ', Configuration ID = ' + configurationID);
			}

			//configuration name can't be blank
			if(!configurationName)
			{
				throw new RangeError('Configuration Name cannot be blank');
			}

			//configuration name cannot already exist
			if(self.checkExistingConfiguration(configurationName) === true)
			{
				throw new Error('Configuration Name already in use. ')
			}

			//configurationID must be in the list of configurations
			if(self.checkExistingConfigurationID(configurationID) === false)
			{
				throw new Error('Configuration ID ' + configurationID + ' cannot be found, please use a different configuration id.');
			}
			
			//build the database parameters
			let parameters = {
				debug: self.debugFlag,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'CopyConfiguration',
				systemID: systemID,
				configurationID: configurationID,
				newName: configurationName,
			};

			//this is for using the transaction log
			if(self.userName && self.pcName && self.applicationName)
			{
				parameters.applicationName = self.applicationName;
				parameters.username = self.userName;
				parameters.pcname = self.pcName;
			}

			self.logDebug('copyConfiguration', 'parameters', parameters);
		
			//call to the database
			ProcessDatabaseRequest(parameters, function(data)
			{
				//when the database responds, process the response
				self.processConfigurationCopy(data);
			});
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * processes the results of copying a configuration
	 * Uses the current settings that are already in memory
	 */
	self.processConfigurationCopy = function(data)
	{
		try
		{
			//a blank JSON object indicates configuration not in database
			if(data === '[]')
			{
				throw new Error('Configuration not found in database');
			}

			//must be a valid JSON object
			if(isJson(data))
			{
				//parse the object and set the IDs
				let response = JSON.parse(data);
				let systemID = parseInt(response[0].CalibrationSystemID);
				let configurationID = parseInt(response[0].ConfigurationID);
				let configurationName = response[0].ConfigurationName;
				let notes = response[0].Notes;

				self.logDebug('processConfigurationCopy', 'configuration copied', response);

				self.addConfiguration(systemID, configurationID, configurationName, notes);

				self.logDebug('processConfigurationCopy', 'configuration added to local memory', configurationID);

				for(let i = 0; i < self.configurationSettings.length; i++)
				{
					if(parseInt(self.configurationSettings[i].ConfigurationID) !== -1)
					{
						self.configurationSettings[i].ConfigurationID = configurationID;
						self.configurationSettings[i].ConfigurationName = configurationName;
					}
				}

				self.logDebug('processConfigurationCopy', 'configuration settings updated with new id', self.configurationSettings);
				self.currentConfiguration = configurationID;
				self.currentConfigurationName = configurationName;
				
				self.logDebug('processConfigurationCopy', 'configuration set to current', configurationID);

				self.emit('configurationCopied', response[0]);
				
				return true;
			}

			//if the code makes it here, then it was not a valid JSON object
			//this is an error
			self.processDatabaseError(data);
			return false;
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Deletes a configuration from the list
	 * In reality, it actually just marks the configuration as archived and then it's no longer visible
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&username=mvorkapich&computername=1234&connection=calibration&storedProcedure=DeleteConfiguration&configurationID=999
	 * Function Type: Async
	 * 
	 * @param {integer} configurationID - the id of the configuration being deleted
	 */
	self.deleteConfiguration = function(configurationID)
	{
		try
		{
			//configuration ID must be a positive integer
			//isPositiveInteger is from sbGlobal
			if(isPositiveInteger(configurationID) === false)
			{
				throw new RangeError('Configuration ID is invalid. Configuration ID = ' + configurationID);
			}

			//configuration ID must be in local memory
			if(self.checkExistingConfigurationID(configurationID) === false)
			{
				throw new Error('Configuration ID ' + configurationID + ' cannot be found, please use a different configuration id.');
			}

			//build the parameters for the database
			let parameters = {
				debug: self.debugFlag,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'DeleteConfiguration',
				configurationID: configurationID,
			};

			//this is for using the transaction log
			if(self.userName && self.pcName && self.applicationName)
			{
				parameters.applicationName = self.applicationName;
				parameters.username = self.userName;
				parameters.pcname = self.pcName;
			}

			self.logDebug('deleteConfiguration', 'parameters', parameters);
	
			//call the database
			ProcessDatabaseRequest(parameters, function(data)
			{
				self.processConfigurationDeleted(data);
			});
		}
		catch(err)
		{
			self.onError(err);
		}

	};

	/**
	 * When the selected configuration is deleted
	 * Updates the configuration list
	 * Clears the current configuration id
	 * Clears the settings object
	 * Function Type: Sync
	 * 
	 * @param {string} data - JSON encoded string
	 */
	self.processConfigurationDeleted = function(data)
	{
		try
		{
			//a blank JSON object indicates configuration not in database
			if(data === '[]')
			{
				throw new Error('Configuration not found in database');
			}

			//must be a valid JSON object
			if(isJson(data))
			{
				let response = JSON.parse(data);
				self.logDebug('processConfigurationDeleted', 'configuration deleted successfully', response);

				//remove the configuration from local memory
				self.configurations = self.configurations.filter(function(configuration)
				{
					return parseInt(configuration.ConfigurationID) !== parseInt(response[0].ConfigurationID);
				});

				self.logDebug('processConfigurationDeleted', 'configuration removed from local memory', self.configurations);

				//clear all the settings
				self.configurationSettings = [];
				self.currentConfiguration = -1;
				self.currentConfigurationName = '';

				self.logDebug('processConfigurationDeleted', 'configuration settings cleared');

				self.emit('configurationDeleted', response[0]);
				return true;
			}

			//if the code makes it here, then it was not a valid JSON object
			//this is an error
			self.processDatabaseError(data);
			return false;
		}
		catch(err)
		{
			self.onError(err);
		}

	};

	/**
	 * Retrieves all the settings for the selected configuration
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=getCalibrationConfigurationV2&configurationID=108
	 * Function Type: Async
	 * 
	 * @param {integer} configurationID - the configuration being recalled
	 */
	self.retrieveConfigurationSettings = function(configurationID)
	{
		try
		{
			//isPositiveInteger is in sbGlobal
			//value must be a positive integer
			if(isPositiveInteger(configurationID) === false)
			{
				throw new RangeError('Configuration ID is invalid. Configuration ID = ' + configurationID);
			}

			//configuration ID must be in local memory
			if(self.checkExistingConfigurationID(configurationID) === false)
			{
				throw new Error('Configuration ID ' + configurationID + ' cannot be found, please use a different configuration id.');
			}

			//build parameters for the database
			let parameters = {
				debug: self.debugFlag,
				dostuff: 'getCalibrationConfigurationV2',
				configurationID: configurationID
			};

			self.logDebug('retrieveConfigurationSettings', 'parameters', parameters);
	
			//call the database
			ProcessDatabaseRequest(parameters, function(data)
			{
				self.processConfigurationSettings(data);
			});
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * When the selected configuration settings have been retrieved
	 * Updates the configuration settings object
	 * Function Type: Sync
	 * 
	 * @param {string} data - JSON encoded string
	 */
	self.processConfigurationSettings = function(data)
	{
		try
		{
			//a blank JSON object indicates configuration not in database
			if(data === '[]')
			{
				throw new Error('Configuration not found in database');
			}

			//must be a valid JSON object
			if(isJson(data))
			{
				//stuff the settings into local memory for later use
				self.configurationSettings = JSON.parse(data);

				self.logDebug('processConfigurationSettings', 'settings retrieved successfully', data);

				self.emit('settingsRetrieved', self.configurationSettings);
				return true;
			}

			//if the code makes it here, then it was not a valid JSON object
			//this is an error
			self.processDatabaseError(data);
			return false;
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Can get any settings by area and, if desired, narrowed down to item name
	 * Case insensitive
	 * Function Type: Sync
	 * 
	 * @param {string} configurationArea - must match the configuration area in the object
	 * @param {string} itemName (optional) - if you want more specific results, include the item name
	 * @return {array} - an array that contains the results. If no results are found, the array will be empty
	 */
	self.getSettings = function(configurationArea, itemName)
	{
		try
		{
			//MUST have configuration area
			if(!configurationArea)
			{
				throw new RangeError('Configuration Area is blank. You must provide Configuration Area in order to retrieve settings.');
			}

			if(configurationArea && itemName)
			{
				//do thing
			}

			if(configurationArea && !itemName)
			{
				return self.getTopLevelNode(configurationArea);
			}

			self.logDebug('getSettings', 'Settings filtered', settings);
			
			return settings;

		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Get the child level nodes for the configuration area based on node name
	 * See configurationManager.test.js for an example
	 * @param {string} configurationArea - the name of the configuration area
	 * @param {string} nodeName - the name of the child nodes to retrieve
	 * @returns {Array} - Array of nodes 
	 */
	self.getChildNodes = function(configurationArea, nodeName)
	{
		try
		{
			//MUST have configuration area
			if(!configurationArea)
			{
				throw new RangeError('Configuration Area is blank. You must provide Configuration Area in order to retrieve settings.');
			}
			//MUST have nodeName
			if(!nodeName)
			{
				throw new RangeError('Node Name is blank. You must provide NodeName in order to retrieve settings.');
			}

			//first get the area
			let settings = self.getTopLevelNode(configurationArea);

			if(settings === null)
			{
				return [];
			}

			//then get the nodes
			let childNodes = settings.childNodes.filter(function(childNode)
			{
				return childNode.displayValue.toLowerCase() === nodeName.toLowerCase();
			});

			return childNodes;
		}
		catch(err)
		{
			self.onError(err);
		}
		return [];
	}

	/**
	 * Retrieve the top level node from the settings
	 * There should only be one of each top level area
	 * See test file configurationManager.test.js for an example
	 * 
	 * @param {string} configurationArea - Name of the configuration area to be retrieved
	 * @returns {object} - Top level node from the settings
	 */
	self.getTopLevelNode = function(configurationArea)
	{
		try
		{
			//MUST have configuration area
			if(!configurationArea)
			{
				throw new RangeError('Configuration Area is blank. You must provide Configuration Area in order to retrieve settings.');
			}

			//filter the settings
			let settings = self.configurationSettings.filter(function(setting)
			{
				//must use configuration area
				return setting.configurationArea.toLowerCase() === configurationArea.toLowerCase();
			});

			self.logDebug('getTopLevelNode', 'Settings filtered', settings);
			
			if(settings.length > 0)
			{
				return settings[0];
			}
		}
		catch(err)
		{
			self.onError(err);
		}
		return null;
	}

	/**
	 * For validating one setting value. Makes sure it has all the required keys
	 * Function Type: Sync
	 * 
	 * @param {object} setting - Example:  
	 * 	{
	 * 		configurationNodeID:1,
	 * 		displayIndex:2,
	 * 		value:'Not Set',
	 * 		itemName: 'SN',
	 * 		nodeSubIndex:1
	 * 	}
	 * 
	 * @returns {boolean} - Is this one setting valid?
	 */
	self.validateSetting = function(setting)
	{
		try
		{
			//must pass in a setting object
			if (!setting)
			{
				throw new Error('No setting object passed in');
			}

			//make sure all the required keys are present
			//if not, that's a problem
			let expectedKeys = [
				'configurationNodeID',
				'displayIndex',
				'value',
				'nodeSubIndex',
				'itemName'
		 	];
			let objectKeys = Object.keys(setting);
			for(let i = 0; i < expectedKeys.length; i++)
			{
				//lets us know there was a match
				let foundIt = false;
				for(let j = 0; j < objectKeys.length; j++)
				{
					//case insensitive check
					if(expectedKeys[i].toLowerCase() === objectKeys[j].toLowerCase())
					{
						foundIt = true;
					}
				}
				if(!foundIt)
				{
					throw new Error('Unable to locate setting value ' + expectedKeys[i] + ' in setting ' + JSON.stringify(setting));
				}	
			}

			self.logDebug('validateSetting', 'setting is valid', setting);
			return true;
		}
		catch(err)
		{
			self.onError(err);
			return false;
		}
	};

	/**
	 * For updating one individual setting
	 * The setting must be in the list
	 * You should never get here if the setting isn't in the list
	 * If it isn't, then nothing will happen and no error will occur
	 * This is a recursive function that seeks out a setting
	 * Function Type: Sync
	 * 
	 * @param {object} setting - a valid setting object. 
	 * {
	 * 		configurationNodeID:1, 
	 * 		displayIndex:2,
	 * 		itemName:'SN', 
	 * 		value:'Not Set',
	 * 		nodeSubIndex:1
	 * }
	 * @returns {boolean} - was the setting updated successfully?
	 */
	self.updateSetting = function(setting, nodes = self.configurationSettings)
	{
		try
		{
			//make sure the setting is a valid setting object
			if(self.validateSetting(setting) === false)
			{
				return false;
			}

			//iterate through the nodes looking for the one we want
			for(let i = 0; i < nodes.length; i++)
			{
				//if this is the one we want, then try to update it
				if(parseInt(nodes[i].configurationNodeID) === parseInt(setting.configurationNodeID)
					&& parseInt(nodes[i].displayIndex) === parseInt(setting.displayIndex)
					&& parseInt(nodes[i].nodeSubIndex) === parseInt(setting.nodeSubIndex))
				{
					//find the correct control and see if we can update it
					for(let j = 0; j < nodes[i].controls.length; j++)
					{
						if(nodes[i].controls[j].label.toLowerCase() === setting.itemName.toLowerCase())
						{
							//change the value if it is found
							nodes[i].controls[j].value = setting.value;
							return true;
						}
					}
				}
				//if this node has child nodes, then check those ones also
				else if(nodes[i].childNodes.length > 0)
				{
					//by checking the result of updateSetting, we can avoid iterating through more
					//nodes if we found the correct one. Just stop there
					if(self.updateSetting(setting, nodes[i].childNodes) === true)
					{
						return true;
					}
				}
			}
		}
		catch(err)
		{
			self.onError(err);
		}
		return false;
	};


	/**
	 * Gets a list of configurations from other calibration systems so they can be imported into this one
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&username=mvorkapich&pcname=1234&applicationname=CalRun&connection=calibration&storedProcedure=GetExternalConfigurations&configurationID=35
	 * Function Type: Async
	 * 
	 * @param {integer} systemID - The ID of the system to ignore (current system)
	 */
	self.retrieveExternalConfigurations = function(systemID)
	{
		try
		{
			//isPositiveInteger is in sbGlobal
			//value must be a positive integer
			if(isPositiveInteger(systemID) === false)
			{
				throw new RangeError('System ID is invalid. System ID = ' + systemID);
			}

			let parameters = {
				debug: self.debugFlag,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'GetExternalConfigurations',
				systemID: systemID
			};

			self.logDebug('retrieveExternalConfigurations', 'parameters', parameters);

			ProcessDatabaseRequest(parameters, function(data)
			{
				self.processExternalConfigurations(data);
			});
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * When external configurations have been retrieved
	 * Simply notifies the world that they are here
	 * 
	 * @param {string} data - JSON encoded string
	 */
	self.processExternalConfigurations = function(data)
	{
		try
		{
			//An empty response from the database means the configuration could not be found in the database
			if(data === '[]')
			{
				throw new Error('No configurations found in database');
			}

			//response must be valid JSON
			//isJson is from sbGlobal
			if(isJson(data))
			{
				let externalConfigurations = JSON.parse(data);
				self.logDebug('externalConfigurationsRetrieved', 'Configurations retrieved successfully', data);

				self.emit('externalConfigurationsRetrieved', externalConfigurations);
				return true;
			}
			//if data is not valid json then it's an error
			self.processDatabaseError(data);
			return false;

		}
		catch(err)
		{
			self.onError(err);
		}
	};

	self.processDatabaseError = function(data)
	{
		try
		{
			//if this code is reached, then the return value from the database was not a JSON object
			//it is probably an error message coming from the database
			let errorMessage = processDatabaseError(data);

			//if it's not an error message, then we don't know what it is and that's a problem
			if(errorMessage === null)
			{
				throw new ReferenceError('Unable to process database response');
			}

			//if it is a database error, then process it
			self.onError(errorMessage);

		}
		catch(err)
		{
			self.onError(err);
		}

	};

	self.onError = function(err)
	{
		self.emit('error', err);
	};

	self.logDebug = function()
	{

	};

	/**
	 * Looks in the list of configurations and determines if the specified one exists
	 * Function Type: sync
	 * 
	 * @param {string} configurationName - the name of the configuration. Names must be unique and cannot be blank
	 * @returns {boolean} - does the configuration exist?
	 */
	self.checkExistingConfiguration = function(configurationName)
	{
		try
		{
			//configuration name cannot be blank
			if(!configurationName)
			{
				throw new Error('Configuration name cannot be blank.');
			}

			//find any configuration that has the same name. This is case insensitive.
			let foundConfigurations = self.configurations.filter(function(configuration)
			{
				return configuration.ConfigurationName.toLowerCase() === configurationName.toLowerCase();
			});

			//if any configurations are found, this is true
			self.logDebug('checkExistingConfiguration', 'found configuration: ' + (foundConfigurations.length > 0));
			return foundConfigurations.length > 0;
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Checks if the specified ID exists in the configuration list in local memory
	 * Function Type: Sync
	 * 
	 * @param {integer} configurationID - the ID of the configuration to check
	 * @returns {boolean} - returns true if the configuration exists
	 */
	self.checkExistingConfigurationID = function(configurationID)
	{
		try
		{
			//check to see that ID passed in is a positive integer
			//this function exists in sbGlobal
			if(isPositiveInteger(configurationID) === false)
			{
				throw new RangeError('Configuration ID is invalid. Configuration ID = ' + configurationID);
			}

			//iterate through local memory to find the ID
			for(let i = 0; i < self.configurations.length ; i++)
			{
				if(parseInt(self.configurations[i].ConfigurationID) === parseInt(configurationID))
				{
					self.logDebug('checkExistingConfigurationID', 'configuration id already exists in the configuration list', configurationID);
					return true;
				}
			}

			//if the program gets to this point, then the configuration ID is not in memory
			self.logDebug('checkExistingConfigurationID', 'configuration id does not exist in the configuration list', configurationID);
			return false;
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	/**
	 * Save the settings to the database
	 * The settings should already be stored in this object
	 */
	self.save = function()
	{
		try
		{
			if(self.configurationSettings.length === 0)
			{
				throw new Error('No settings found, cannot save');
			}
			let parameters = {
				dostuff: 'SaveCalibrationSystemSettingsV2',
				debug: self.debugFlag,
				values: self.configurationSettings,
			};

			//this is for using the transaction log
			if(self.userName && self.pcName && self.applicationName)
			{
				parameters.applicationName = self.applicationName;
				parameters.username = self.userName;
				parameters.pcname = self.pcName;
			}

			self.logDebug('save', 'parameters', parameters);

			ProcessDatabaseRequest(parameters, function(data)
			{
				//the return from the database should be the settings
				self.processConfigurationSettings(data);
			});

		}
		catch(err)
		{
			self.onError(err);
		}
	}

	//TODO: Needs Unit Tests
	self.convertToDeviceItem = function(itemName)
	{
		try
		{
			switch(itemName)
			{
			case 'device':
				return 'modelNumber';
			case 'baud':
				return 'baudRate';
			case 'port':
				return 'portName';
			case 'sn':
				return 'serialNumber';
			default:
				return itemName;	
			}
	
		}
		catch(err)
		{
			self.onError(err);
		}
		return null;
	};


	//TODO: Needs Unit tests
	self.setupDeviceList = function(deviceType)
	{
		try
		{
			let deviceSettings = self.getTopLevelNode(deviceType);
			let deviceList = [];
			
			if(deviceSettings !== null)
			{
				for(let i = 0; i < deviceSettings.childNodes.length; i++)
				{
					let deviceNode = deviceSettings.childNodes[i];
					let device = new Device();
					device.isReference = deviceType.toLowerCase() === 'reference';
					device.index = i;
					for(let j = 0; j < deviceNode.controls.length; j++)
					{
						let control = deviceNode.controls[j];
						let itemName = self.convertToDeviceItem(toCamelCase(control.label));
						let itemValue = control.value;
						if(device.hasOwnProperty(itemName))
						{
							device[itemName] = itemValue;
						}
						if(itemName === 'settings')
						{
							device.dataBits = itemValue.substring(itemValue.indexOf(',') + 1).trim();
							device.parityBit = itemValue.substring(0, 1);
						}
					}
					
					deviceList.push(device);
				}

			}

			return deviceList;			
	
		}
		catch(err)
		{
			self.onError(err);
		}
	};

	//TODO: Need to set up data points
	//NOTE: Can't do this until data points are defined better
	//Should be a bunch of devices associated with each data point
	self.setupDataPoints = function()
	{
		try
		{

		}
		catch(err)
		{
			self.onError(err);
		}
	};

	//TODO: determine device types that can be calibrated
	//Maybe this is a new section?
	self.setupSettings = function()
	{
		try
		{
			let settings = {};
			let systemSettings = self.getTopLevelNode('settings');
			for(let i = 0; i < systemSettings.controls.length; i++)
			{
				let control = systemSettings.controls[i];
				let itemName = toCamelCase(removeParentheses(control.label));
				let itemValue = control.value;
				settings[itemName] = itemValue;
			}
			console.log(settings);
		}
		catch(err)
		{
			console.log(err);
			self.onError(err);
		}
	};
}

/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
{
	module.exports =
    {
    	ConfigurationManager:ConfigurationManager
    };
}

