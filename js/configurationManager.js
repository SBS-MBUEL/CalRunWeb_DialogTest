'use strict';

/**
 * For managing all aspects of the system configuration
 * Including holding the settings, finding settings, saving settings and recalling settings
 * The class includes debug logging ability 
 * All asynchronous functions provide for a callback and an event listener
 * 
 * Event listeners are:
 *    configurationCopied
 *    configurationDeleted
 *    configurationRenamed
 *    configurationsRetrieved
 *    configurationSaved
 * 	  configurationSetAsCurrent
 *    debug
 *    error
 *    newConfigurationCreated
 *    settingsAdded
 *    settingsRetrieved
 *    settingUpdated
 * 
 * @param {boolean} isDebug - if we should access the debug database
 */
function ConfigurationManager(isDebug)
{
	let self = this;

	self.listener = new SBListener();
	self.on = self.listener.on;
	self.emit = self.listener.emit;

	self.configurations = [];
	self.currentConfiguration = -1;
	self.currentConfigurationName = '';
	self.configurationTabs = [];
	self.configurationSettings = [];
	self.debugFlag = isDebug === true;
	self.userName = '';
	self.pcName = '';
	self.applicationName = '';

	/**
	 * Recalls a list of configurations that have been stored in the database
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&username=mvorkapich&pcname=1234&applicationname=CalRun&connection=calibration&storedProcedure=RecallConfigurations&systemID=35
	 * Function Type: Async
	 * 
	 * @param {integer} systemID - ID number of the system from the database
	 * @param {function} callback - a function to be called when the database call is complete
	 */
	self.recallConfigurations = function(systemID, callback)
	{
		try
		{
			if(isPositiveInteger(systemID) === false)
			{
				//If the ID is not a positive integer, this is a problem. Typically, this will be because the system has not yet been named
				self.onError('recallConfigurations', 'Invalid System ID. Has the system been given a name yet?', new Error());
				return false;
			}
			let parameters = {
				debug: self.debugFlag,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'RecallConfigurations',
				systemID: systemID
			};

			self.logDebug('recallConfigurations', 'parameters', parameters);

			ProcessDatabaseRequest(parameters, function(data)
			{
				self.configurationsRetrieved(data, callback);
			});
		}
		catch(err)
		{
			self.onError('recallConfigurations', err.message, err);
			return false;
		}
	};

	/**
	 * For processing retrieved configuration data
	 * Function Type: Sync
	 * 
	 * @param {string} data - JSON object to be processed
	 * @param {function} callback - function to be called 
	 * @returns {boolean} if the processing of retrieved data was successful
	 */
	self.configurationsRetrieved = function(data, callback)
	{
		try
		{
			if(isJson(data))
			{
				self.configurations = JSON.parse(data);
				let currentConfig = self.configurations.filter(function(config)
				{
					return parseInt(config.CurrentConfiguration) === 1;
				});

				if(currentConfig.length > 0)
				{
					self.currentConfiguration = currentConfig[0].ConfigurationID;
					self.currentConfigurationName = currentConfig[0].ConfigurationName;
					
				}
				//console.log(currentConfig);
				executeCallback(callback, self.configurations);
				self.emit('configurationsRetrieved', self.configurations);
				self.logDebug('configurationsRetrieved', 'configuration retrieved successfully', data);
			}
			else
			{
				let errorMessage = processDatabaseError(data);
				if(errorMessage === null)
				{
					self.onError('configurationsRetrieved', 'Unable to process database response: ' + data, new Error());
					return false;
				}
				self.processError(errorMessage.Class, errorMessage.Function, errorMessage.Message, new Error());
				return false;
			}
			return true;
		}
		catch(err)
		{
			self.onError('configurationsRetrieved', err.message, err);
			return false;
		}
	};

	/**
	 * Creates a new, blank, named configuration in the database
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&username=mvorkapich&computername=1234&connection=calibration&storedProcedure=CreateNewConfiguration&systemID=35&configurationName=blargyblarg
	 * Function Type: Async
	 * 
	 * @param {integer} systemID - the ID of the system from the database
	 * @param {string} configurationName - the new name
	 * @param {function} callback - function to be run with the creation is complete
	 */
	self.createNewConfiguration = function(systemID, configurationName, callback)
	{
		try
		{
			if(isPositiveInteger(systemID) === false)
			{
				self.onError('createNewConfiguration', 'System ID must be a positive integer, ' + systemID + ' was passed in', new Error());
				return false;
			}
			if(!configurationName)
			{
				self.onError('createNewConfiguration', 'Configuration name cannot be blank', new Error());
				return false;
			}

			if(self.checkExistingConfiguration(configurationName) === true)
			{
				self.onError('createNewConfiguration', 'Configuration already exists with the name ' + configurationName + ', please select a different name.', new Error());
				return false;
			}

			let parameters = {
				debug: self.debugFlag,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'CreateNewConfiguration',
				systemID: systemID,
				configurationName: configurationName,
				applicationname: self.applicationName,
				username: self.userName,
				pcname: self.pcName
			};

			self.logDebug('createNewConfiguration', 'parameters', parameters);
	
			ProcessDatabaseRequest(parameters, function(data)
			{
				self.newConfigurationCreated(data, callback);
			});
		}
		catch(err)
		{
			self.onError('createNewConfiguration', err.message, err);
			return false;
		}
	};

	/**
	 * When a new configuration has been created, this gets called
	 * Puts the configuration into the configuration list and clears out the settings
	 * Function Type: Sync
	 * 
	 * @param {string} data - JSON encoded string
	 * @param {function} callback - function to be called
	 * @returns {boolean} was the configuration created successfully?
	 */
	self.newConfigurationCreated = function(data, callback)
	{
		try
		{
			if(isJson(data))
			{
				let reply = JSON.parse(data);
				if(reply.length === 0)
				{
					self.onError('newConfigurationCreated', 'Unable to detect newly created configuration id', new Error());
					return false;
				}

				//once the new configuration exists, need to add the configuration to the list
				let configurationID = parseInt(reply[0].newConfigurationID);
				self.configurationSettings = [];
				self.addConfiguration(reply[0].calibrationSystemID, configurationID, reply[0].configurationName);
				self.currentConfiguration = configurationID;
				self.currentConfigurationName = reply[0].configurationName;
				executeCallback(callback, configurationID);
				self.emit('newConfigurationCreated', configurationID);
				self.logDebug('newConfigurationCreated', 'configuration created successfully', data);
			}
			else
			{
				let errorMessage = processDatabaseError(data);
				if(errorMessage === null)
				{
					self.onError('newConfigurationCreated', 'Unable to process database response: ' + data, new Error());
					return false;
				}
				self.processError(errorMessage.Class, errorMessage.Function, errorMessage.Message, new Error());
				return false;
			}
			return true;

		}
		catch(err)
		{
			self.onError('newConfigurationCreated', err.message, err);
			return false;
		}
	};

	/**
	 * Adds a configuration to the configuration list. This is really intended for internal use only
	 * This does set the new configuration as the current configuration
	 * Function Type: Sync
	 * 
	 * @param {integer} systemID - ID of the system
	 * @param {integer} configurationID - ID of the new configuration
	 * @param {string} configurationName - The name of the new configuration
	 * 
	 * @returns {boolean} - did the adding succeed or fail?
	 */
	self.addConfiguration = function(systemID, configurationID, configurationName, notes)
	{
		try
		{
			if(!notes)
			{
				notes = null;
			}
			if(isPositiveInteger(systemID) === false || isPositiveInteger(configurationID) === false)
			{
				self.onError('addConfiguration', 'System ID and Configuration ID must both be a positive integer, systemID: ' + systemID + ', configurationID: ' + configurationID + ' were passed in', new Error());
				return false;
			}
			if(!configurationName)
			{
				self.onError('addConfiguration', 'Configuration name cannot be blank', new Error());
				return false;
			}

			if(self.checkExistingConfiguration(configurationName) === true)
			{
				self.onError('addConfiguration', 'Configuration already exists with the name ' + configurationName + ', please select a different name.', new Error());
				return false;
			}

			self.configurations.forEach(function(configuration)
			{
				configuration.CurrentConfiguration = 0;
			});

			self.logDebug('addConfiguration', 'set all configurations to not current');
	
			let newConfiguration = {
				ConfigurationID:configurationID,
				ConfigurationName:configurationName,
				CalibrationSystemID:systemID,
				CurrentConfiguration:1,
				Notes:notes
			};

			self.logDebug('addConfiguration', 'new configuration', newConfiguration);
	
			self.configurations.push(newConfiguration);

			self.logDebug('addConfiguration', 'new configuration added to configuration list', self.configurations);

			return true;
		}		
		catch(err)
		{
			self.onError('addConfiguration', err.message, err);
			return false;
		}
	};

	/**
	 * Looks in the list of configurations and determines if the specified one exists
	 * Function Type: Sync
	 * 
	 * @param {string} configurationName - the name of the configuration. Names must be unique
	 * @returns {boolean} - does the configuration exist?
	 */
	self.checkExistingConfiguration = function(configurationName)
	{
		try
		{
			if(!configurationName)
			{
				self.onError('checkExistingConfiguration', 'Configuration name cannot be blank', new Error());
				return false;
			}

			//see if the configuration is in the list
			let foundConfigurations = self.configurations.filter(function(configuration)
			{
				return configuration.ConfigurationName.toLowerCase() === configurationName.toLowerCase();
			});
	
			self.logDebug('checkExistingConfiguration', 'found configuration: ' + (foundConfigurations.length > 0));
			return foundConfigurations.length > 0;
		}
		catch(err)
		{
			self.onError('checkExistingConfiguration', err.message, err);
			return false;
		}
	};

	/**
	 * Renames an existing configuration
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&username=mvorkapich&computername=1234&connection=calibration&storedProcedure=RenameConfiguration&configurationID=71&newName=cowabunga
	 * Function Type: Async
	 * 
	 * @param {integer} configurationID - must be an existing configuration
	 * @param {string} newName - the name to assign to the configuration
	 * @param {function} callback - function to be run when the renaming is complete
	 */
	self.renameConfiguration = function(configurationID, newName, callback)
	{
		try
		{
			if(isPositiveInteger(configurationID) === false)
			{
				self.onError('renameConfiguration', 'Configuration ID must be a positive integer, ' + configurationID + ' was passed in', new Error());
				return false;
			}
			if(!newName)
			{
				self.onError('renameConfiguration', 'Configuration name cannot be blank');
				return false;
			}

			if(self.checkExistingConfiguration(newName) === true)
			{
				self.onError('renameConfiguration', 'Configuration already exists with the name ' + newName + ', please select a different name.', new Error());
				return false;
			}

			if(self.checkExistingConfigurationID(configurationID) === false)
			{
				self.onError('renameConfiguration', 'Configuration ID ' + configurationID + ' cannot be found, please use a different configuration id', new Error());
				return false;
			}

			let parameters = {
				debug: self.debugFlag,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'RenameConfiguration',
				configurationID: configurationID,
				newName: newName,
				applicationname: self.applicationName,
				username: self.userName,
				pcname: self.pcName
	
			};

			self.logDebug('renameConfiguration', 'parameters', parameters);
	
			ProcessDatabaseRequest(parameters, function(data)
			{
				self.configurationRenamed(data, callback);
			});
		}
		catch(err)
		{
			self.onError('renameConfiguration', err.message, err);
			return false;
		}
	};

	/**
	 * When a configuration has been renamed, this gets called
	 * Updates the configuration name in the configuration list
	 * Function Type: Sync
	 * 
	 * @param {string} data - JSON encoded string
	 * @param {function} callback - function to be called
	 * @returns {boolean} was the configuration renamed successfully?
	 */
	self.configurationRenamed = function(data, callback)
	{
		try
		{
			if(isJson(data))
			{
				let configInfo = JSON.parse(data);
				let configID = parseInt(configInfo[0]['ConfigurationID']);

				//once the database request is processed, update the configuration list with the new name
				for(let i = 0; i < self.configurations.length; i++)
				{
					if(parseInt(self.configurations[i].ConfigurationID) === configID)
					{
						self.configurations[i].ConfigurationName = configInfo[0]['ConfigurationName'];
						break;
					}
				}
				executeCallback(callback, configInfo[0]);
				self.emit('configurationRenamed', configInfo[0]);
				self.logDebug('configurationRenamed', 'configuration renamed successfully', configInfo[0]);
			}
			else
			{
				let errorMessage = processDatabaseError(data);
				if(errorMessage === null)
				{
					self.onError('configurationRenamed', 'Unable to process database response: ' + data, new Error());
					return false;
				}
				self.processError(errorMessage.Class, errorMessage.Function, errorMessage.Message, new Error());
				return false;
			}
			return true;

		}
		catch(err)
		{
			self.onError('configurationRenamed', err.message, err);
			return false;
		}
	};

	/**
	 * Checks if the specified ID exists in the configuration list
	 * Function Type: Sync
	 * 
	 * @param {integer} configurationID - the id of the configuration to check
	 * @returns {boolean} - does the configuration exist?
	 */
	self.checkExistingConfigurationID = function(configurationID)
	{
		try
		{
			if(isPositiveInteger(configurationID) === false)
			{
				self.onError('checkExistingConfigurationID', 'Configuration ID must be a positive integer, ' + configurationID + ' was passed in', new Error());
				return false;
			}

		
			for(let i = 0; i < self.configurations.length; i++)
			{
				if(parseInt(self.configurations[i].ConfigurationID) === parseInt(configurationID))
				{
					self.logDebug('checkExistingConfigurationID', 'configuration id already exists in the configuration list', configurationID);
					return true;
				}
			}
			self.logDebug('checkExistingConfigurationID', 'configuration id does not exist in the configuration list', configurationID);
			return false;
		}
		catch(err)
		{
			self.onError('checkExistingConfigurationID', err.message, err);
			return false;
		}
	};

	/**
	 * Pass through to the setCurrentConfiguration function
	 * Looks up the configuration ID and passes it to the next function
	 * 
	 * @param {integer} systemID - ID of the system
	 * @param {string} configurationName - must be unique in the configurations list
	 * @param {funtion} callback - function that will be called when the setting is done
	 * @returns {boolean} - did the function execute through to the database call. Since the database call is asynchronous, we won't know if it succeeded until leter.
	 */
	self.setCurrentConfigurationByName = function(systemID, configurationName, callback)
	{
		try
		{
			if(isNaN(systemID) || systemID < 1)
			{
				self.onError('setCurrentConfigurationByName', 'System ID must be a positive integer, ' + systemID + ' was passed in', new Error());
				return false;
			}

			if(typeof configurationName !== 'string')
			{
				self.onError('setCurrentConfigurationByName', 'Configuration name must be a string, ' + configurationName + ' was passed in', new Error());
				return false;
			}

			if(!systemID || !configurationName)
			{
				self.onError('setCurrentConfigurationByName', 'System ID and Configuration Name cannot be blank', new Error());
				return false;
			}

			let selectedConfigurations = self.configurations.filter(function(configuration)
			{
				return configuration.ConfigurationName.toLowerCase() === configurationName.toLowerCase();
			});

			if(selectedConfigurations.length === 0)
			{
				self.logDebug('setCurrentConfigurationByName', 'Cannot find specified configuration', configurationName);
				self.onError('setCurrentConfigurationByName', 'Cannot find specified configuration: ' + configurationName, new Error());
				return false;
			}

			if(selectedConfigurations.length > 0)
			{
				self.logDebug('setCurrentConfigurationByName', 'Found specified configuration', configurationName);
				return self.setCurrentConfiguration(systemID, selectedConfigurations[0].ConfigurationID, callback);
			}

			return false;
		}
		catch(err)
		{
			self.onError('setCurrentConfigurationByName', err.message, err);
			return false;
		}
	};

	/**
	 * Sets the specified configuration as current
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&username=mvorkapich&pcname=1234&connection=calibration&storedProcedure=SetCurrentConfiguration&systemID=35&configurationID=35&applicationname=CalRun
	 * Function Type: Async
	 * 
	 * @param {integer} systemID - the ID of the calibration system
	 * @param {integer} configurationID - the ID of the configuration to set as current
	 */
	self.setCurrentConfiguration = function(systemID, configurationID, callback)
	{
		try
		{
			if(isPositiveInteger(systemID) === false || isPositiveInteger(configurationID) === false)
			{
				self.onError('setCurrentConfiguration', 'System ID and Configuration ID must both be a positive integer, systemID: ' + systemID + ', configurationID: ' + configurationID + ' were passed in', new Error());
				return false;
			}
			if(self.checkExistingConfigurationID(configurationID) === false)
			{
				self.onError('setCurrentConfiguration', 'Configuration ID ' + configurationID + ' cannot be found, please use a different configuration id', new Error());
				return false;
			}

			let parameters = {
				debug: self.debugFlag,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'SetCurrentConfiguration',
				systemID: systemID,
				configurationID: configurationID,
				applicationname: self.applicationName,
				username: self.userName,
				pcname: self.pcName
			};

			self.logDebug('setCurrentConfiguration', 'parameters', parameters);
	
			ProcessDatabaseRequest(parameters, function(data)
			{
				self.configurationSetAsCurrent(data, callback);
			});
			return true;
		}
		catch(err)
		{
			self.onError('setCurrentConfiguration', err.message, err);
			return false;
		}
	};

	/**
	 * When the selected configuration is set as the current one
	 * Updates the configuration list
	 * Sets the current configuration ID in the object
	 * Function Type: Sync
	 * 
	 * @param {string} data - JSON encoded string
	 * @param {function} callback - function to be called
	 * @returns {boolean} was the configuration set successfully?
	 */
	self.configurationSetAsCurrent = function(data, callback)
	{
		try
		{
			if(isJson(data))
			{
				let configInfo = JSON.parse(data);
				let configID = parseInt(configInfo[0].ConfigurationID);
				self.currentConfiguration = configID;
				self.currentConfigurationName = configInfo[0].ConfigurationName;

				self.logDebug('configurationSetAsCurrent', 'set current configuration ID', configID);

				//once the database is updated, need to update the local list with which one is current
				for(let i = 0; i < self.configurations.length; i++)
				{
					self.configurations[i].CurrentConfiguration = 0;
					if(parseInt(self.configurations[i].ConfigurationID) === configID)
					{
						self.configurations[i].CurrentConfiguration = 1;
					}
				}

				self.logDebug('configurationSetAsCurrent', 'updated configurations object', self.configurations);

				executeCallback(callback, configInfo[0]);
				self.emit('configurationSetAsCurrent', configInfo[0]);
			}
			else
			{
				let errorMessage = processDatabaseError(data);
				if(errorMessage === null)
				{
					self.onError('configurationSetAsCurrent', 'Unable to process database response: ' + data, new Error());
					return false;
				}
				self.processError(errorMessage.Class, errorMessage.Function, errorMessage.Message, new Error());
				return false;
			}
			return true;

		}
		catch(err)
		{
			self.onError('configurationSetAsCurrent', err.message, err);
			return false;
		}
	};

	/**
	 * Creates a duplicate of a specified configuration so it can be used as a starting point for a new configuration
	 * Function Type: Async
	 * 
	 * @param {integer} sysemID - the id of the system
	 * @param {integer} configurationID - the id of the configuration to be used
	 * @param {string} newName - the new name of the configuration
	 * @param {function} callback - (optional) the function to be run when the copy is complete
	 * 
	 */
	self.copyConfiguration = function(systemID, configurationID, newName, callback)
	{
		try
		{
			if(isPositiveInteger(systemID) === false || isPositiveInteger(configurationID) === false)
			{
				self.onError('copyConfiguration', 'System ID and Configuration ID must both be a positive integer, systemID: ' + systemID + ', configurationID: ' + configurationID + ' were passed in', new Error());
				return false;
			}
			if(!newName)
			{
				self.onError('copyConfiguration', 'Configuration name cannot be blank', new Error());
				return false;
			}

			if(self.checkExistingConfiguration(newName) === true)
			{
				self.onError('copyConfiguration', 'Configuration already exists with the name ' + newName + ', please select a different name.', new Error());
				return false;
			}

			let parameters = {
				debug: self.debugFlag,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'CopyConfiguration',
				systemID: systemID,
				configurationID: configurationID,
				newName: newName,
				applicationname: self.applicationName,
				username: self.userName,
				pcname: self.pcName
			};

			self.logDebug('copyConfiguration', 'parameters', parameters);
	
			ProcessDatabaseRequest(parameters, function(data)
			{
				self.configurationCopied(data, callback);
			});
		}
		catch(err)
		{
			self.onError('copyConfiguration', err.message, err);
			return false;
		}

	};

	/**
	 * When the selected configuration is copied
	 * Updates the configuration list
	 * Sets the current configuration ID in the object
	 * Updates the settings object with the new configuration ID
	 * Function Type: Sync
	 * 
	 * @param {string} data - JSON encoded string
	 * @param {function} callback - function to be called
	 * @returns {boolean} was the configuration copied successfully?
	 */
	self.configurationCopied = function(data, callback)
	{
		try
		{
			if(isJson(data))
			{
				let response = JSON.parse(data);
				let systemID = response[0].CalibrationSystemID;
				let configurationID = response[0].ConfigurationID;
				let configurationName = response[0].ConfigurationName;
				let notes = response[0].Notes;

				//once the configuration is copied in the database, it needs to be added to the
				//local objects
				self.addConfiguration(systemID, configurationID, configurationName, notes);

				self.logDebug('configurationCopied', 'configuration added', response);

				for(let i = 0; i < self.configurationSettings.length; i++)
				{
					if(parseInt(self.configurationSettings[i].ConfigurationID) !== -1)
					{
						self.configurationSettings[i].ConfigurationID = configurationID;
						self.configurationSettings[i].ConfigurationName = configurationName;
					}
				}

				self.logDebug('configurationCopied', 'configuration settings updated with new id', self.configurationSettings);

				self.currentConfiguration = parseInt(configurationID);

				self.logDebug('configurationCopied', 'configuration set to current', configurationID);
				executeCallback(callback, response[0]);
				self.emit('configurationCopied', response[0]);
			}
			else
			{
				let errorMessage = processDatabaseError(data);
				if(errorMessage === null)
				{
					self.onError('configurationCopied', 'Unable to process database response: ' + data, new Error());
					return false;
				}
				self.processError(errorMessage.Class, errorMessage.Function, errorMessage.Message);
				return false;
			}
			return true;

		}
		catch(err)
		{
			self.onError('configurationCopied', err.message, err);
			return false;
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
	self.deleteConfiguration = function(configurationID, callback)
	{
		try
		{
			if(isPositiveInteger(configurationID) === false)
			{
				self.onError('deleteConfiguration', 'Configuration ID must be a positive integer, ' + configurationID + ' was passed in', new Error());
				return false;
			}

			if(self.checkExistingConfigurationID(configurationID) === false)
			{
				self.onError('deleteConfiguration', 'Configuration ID ' + configurationID + ' cannot be found, please use a different configuration id', new Error());
				return false;
			}

			let parameters = {
				debug: self.debugFlag,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'DeleteConfiguration',
				configurationID: configurationID,
				applicationname: self.applicationName,
				username: self.userName,
				pcname: self.pcName
			};

			self.logDebug('deleteConfiguration', 'parameters', parameters);
	
			ProcessDatabaseRequest(parameters, function(data)
			{
				self.configurationDeleted(data, callback);
			});
		}
		catch(err)
		{
			self.onError('deleteConfiguration', err.message, err);
			return false;
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
	 * @param {function} callback - function to be called
	 * @returns {boolean} was the configuration deleted successfully?
	 */
	self.configurationDeleted = function(data, callback)
	{
		try
		{
			if(isJson(data))
			{
				let response = JSON.parse(data);
				self.logDebug('configurationDeleted', 'configuration deleted successfully', response);

				//once the configuration has been deleted, it needs to be removed from the list
				self.configurations = self.configurations.filter(function(configuration)
				{
					return parseInt(configuration.ConfigurationID) !== parseInt(response[0].ConfigurationID);
				});

				self.logDebug('configurationDeleted', 'configuration removed from configuration list', self.configurations);

				self.configurationSettings = [];
				self.currentConfiguration = -1;
				self.currentConfigurationName = '';

				self.logDebug('configurationDeleted', 'configuration settings cleared');
				executeCallback(callback, response[0]);
				self.emit('configurationDeleted', response[0]);
			}
			else
			{
				let errorMessage = processDatabaseError(data);
				if(errorMessage === null)
				{
					self.onError('configurationDeleted', 'Unable to process database response: ' + data, new Error());
					return false;
				}
				self.processError(errorMessage.Class, errorMessage.Function, errorMessage.Message, new Error());
				return false;
			}
			return true;

		}
		catch(err)
		{
			self.onError('configurationDeleted', err.message, err);
			return false;
		}
	};

	/**
	 * Retrieves all the settings for the selected configuration
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&username=mvorkapich&pcname=1234&applicationname=CalRun&connection=calibration&storedProcedure=GetConfigurationSettings&systemID=35&configurationID=35
	 * Function Type: Async
	 * 
	 * @param {integer} systemID - id of the system, used to get calibratable device information
	 * @param {integer} configurationID - the configuration being recalled
	 * @param {function} callback - (optional) function to be called when the settings have been retrieved
	 */
	self.getConfigurationSettings = function(systemID, configurationID, callback)
	{
		try
		{
			if(isPositiveInteger(systemID) === false || isPositiveInteger(configurationID) === false)
			{
				self.onError('getConfigurationSettings', 'System ID and Configuration ID must both be a positive integer, systemID: ' + systemID + ', configurationID: ' + configurationID + ' were passed in', new Error());
				return false;
			}

			let parameters = {
				debug: self.debugFlag,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'GetConfigurationSettings',
				systemID: systemID,
				configurationID: configurationID
			};
			//console.warn(parameters);
			self.logDebug('getConfigurationSettings', 'parameters', parameters);
	
			ProcessDatabaseRequest(parameters, function(data)
			{
				self.settingsRetrieved(data, callback);
			});
		}
		catch(err)
		{
			self.onError('getConfigurationSettings', err.message, err);
			return false;
		}
	};

	/**
	 * When the selected configuration settings have been retrieved
	 * Updates the configuration settings object
	 * Function Type: Sync
	 * 
	 * @param {string} data - JSON encoded string
	 * @param {function} callback - function to be called
	 * @returns {boolean} were the settings retrieved successfully?
	 */
	self.settingsRetrieved = function(data, callback)
	{
		try
		{
			if(isJson(data))
			{
				//when the configuration settings are retrieved
				//put them in the settings list
				self.configurationSettings = JSON.parse(data);

				self.logDebug('settingsRetrieved', 'settings retrieved successfully', data);
				//console.warn(self.configurationSettings);
				executeCallback(callback, self.configurationSettings);
				self.emit('settingsRetrieved', self.configurationSettings);
			}
			else
			{
				let errorMessage = processDatabaseError(data);
				if(errorMessage === null)
				{
					self.onError('settingsRetrieved', 'Unable to process database response: ' + data, new Error());
					return false;
				}
				self.processError(errorMessage.Class, errorMessage.Function, errorMessage.Message, new Error());
				return false;
			}
			return true;

		}
		catch(err)
		{
			self.onError('settingsRetrieved', err.message, err);
			return false;
		}
	};

	/**
	 * Returns a subset of the settings that contains only the area of interest
	 * Function Type: Sync
	 * 
	 * @param {string} configurationArea - must be an area that's in the settings list.
	 * @returns {array} - array containing the desired configuration area. If the area doesn't exist, the array will be empty
	 */
	self.getConfigurationByArea = function(configurationArea)
	{
		try
		{
			if(!configurationArea)
			{
				self.onError('getConfigurationByArea', 'Configuration area name cannot be blank', new Error());
				return false;
			}

			//simple filter function
			let configArea = self.configurationSettings.filter(function(setting)
			{
				return setting.ConfigurationArea.toLowerCase() === configurationArea.toLowerCase();
			});

			self.logDebug('getConfigurationByArea', 'configuration area filtered', configArea);

			return configArea;
		}
		catch(err)
		{
			self.onError('getConfigurationByArea', err.message, err);
			return false;
		}
	};

	/**
	 * Intended for removing all the settings from one area before adding back in a bunch of new ones
	 * Function Type: Sync
	 * 
	 * @param {string} configurationArea - the area to clear out
	 * @returns {boolean} - did the clearing work?
	 */
	self.clearSettings = function(configurationArea)
	{
		try
		{
			if(!configurationArea)
			{
				self.onError('clearSettings', 'Configuration area cannot be blank', new Error());
				return false;
			}

			//Remove all the settings for the one configuration area
			for(let i = self.configurationSettings.length - 1; i > -1; i--)
			{
				if(self.configurationSettings[i].ConfigurationArea === configurationArea)
				{
					self.configurationSettings.splice(i, 1);
				}
			}

			self.logDebug('clearSettings', 'settings cleared for area ' + configurationArea, self.configurationSettings);
			return true;
		}
		catch(err)
		{
			self.onError('clearSettings', err.message, err);
			return false;
		}
	};

	/**
	 * For adding settings to the settings object. Does not allow duplicate settings
	 * Example setting object : {ConfigurationID:35,ConfigurationName:'default',ConfigurationArea:'dataPoint',OptionIndex:0,ParameterIndex:0,ItemName:'Device Type',ItemValue:'System'}
	 * Must be a valid array of setting objects
	 * Function Type: Sync
	 * 
	 * @param {object} settings - Array of setting objects
	 * @returns {boolean} - did the adding work?
	 */
	self.addSettings = function(settings)
	{
		try
		{
			if(self.validateSettings(settings) === false)
			{
				return false;
			}

			self.logDebug('addSettings', 'settings valid', settings);

			//make sure the setting doesn't already exist
			for(let i = 0; i < settings.length; i++)
			{
				for(let j = 0; j < self.configurationSettings.length; j++)
				{
					if(settings[i].ConfigurationArea === self.configurationSettings[j].ConfigurationArea &&
						parseInt(settings[i].OptionIndex) === parseInt(self.configurationSettings[j].OptionIndex) &&
						parseInt(settings[i].ParameterIndex) === parseInt(self.configurationSettings[j].ParameterIndex) &&
						settings[i].ItemName.toLowerCase() === self.configurationSettings[j].ItemName.toLowerCase() )
					{
						self.onError('addSettings', 'Setting is already present: ' + JSON.stringify(settings[i]), new Error());
						return false;
					}
				}
			}

			self.logDebug('addSettings', 'settings do not already exist', settings);

			//add the new setting
			for(let i = 0; i < settings.length; i++)
			{
				settings[i].ConfigurationID = self.currentConfiguration;
				settings[i].ConfigurationName = self.currentConfigurationName;
				self.configurationSettings.push(settings[i]);
			}

			self.logDebug('addSettings', 'settings added', settings);

			self.emit('settingsAdded', settings);
			return true;
		}
		catch(err)
		{
			self.onError('addSettings', err.message, err);
			return false;
		}
	};

	/**
	 * For validating an array of settings
	 * Function Type: Sync
	 * 
	 * @param {array} settings - Example
	 * @returns {boolean} - are the settings valid?
	 */
	self.validateSettings = function(settings)
	{
		try
		{
			if(Array.isArray(settings) === false || settings.length === 0)
			{
				self.onError('validateSettings', 'No settings passed in', new Error());
				return false;
			}

			for(let i = 0; i < settings.length; i++)
			{
				if(self.validateSetting(settings[i]) === false)
				{
					return false;
				}
			}

			self.logDebug('validateSettings', 'all settings are valid', settings);
	
			return true;
		}
		catch(err)
		{
			self.onError('validateSettings', err.message, err);
			return false;
		}
	};

	/**
	 * For validating one setting value. Makes sure it has all the required keys
	 * Function Type: Sync
	 * 
	 * @param {object} setting - Example: {ConfigurationArea:'dataPoint', OptionIndex:0, ParameterIndex:0, ItemName:'Device Type', ItemValue:'System'}
	 * @returns {boolean} - Is this one setting valid?
	 */
	self.validateSetting = function(setting)
	{
		try
		{
			if (!setting)
			{
				self.onError('validateSetting', 'No setting object passed in', new Error());
				return false;
			}

			//make sure all the required keys are present
			//if not, that's a problem
			let expectedKeys = ['ConfigurationArea', 'OptionIndex', 'ParameterIndex', 'ItemName', 'ItemValue'];
			let objectKeys = Object.keys(setting);
			for(let i = 0; i < expectedKeys.length; i++)
			{
				if(objectKeys.indexOf(expectedKeys[i]) === -1)
				{
					self.onError('validateSettings', 'Unable to locate setting value ' + expectedKeys[i] + ' in setting ' + JSON.stringify(setting), new Error());
					self.logDebug('validateSetting', 'setting is not valid', setting);
					return false;
				}
			}

			self.logDebug('validateSetting', 'setting is valid', setting);
			return true;
		}
		catch(err)
		{
			self.onError('validateSetting', err.message, err);
			return false;
		}
	};

	/**
	 * For updating one individual setting
	 * If the setting isn't in the list, then add it
	 * Function Type: Sync
	 * 
	 * @param {object} setting - a valid setting object. See validateSetting for an example object
	 * @returns {boolean} - was the setting updated successfully?
	 */
	self.updateSetting = function(setting)
	{
		try
		{
			if(self.validateSetting(setting) === false)
			{
				return false;
			}
			let foundIt = false;

			//try to update the setting
			for(let i = 0; i < self.configurationSettings.length; i++)
			{
				if(self.configurationSettings[i].ConfigurationArea.toLowerCase() === setting.ConfigurationArea.toLowerCase()
					&& parseInt(self.configurationSettings[i].OptionIndex) === parseInt(setting.OptionIndex)
					&& parseInt(self.configurationSettings[i].ParameterIndex) === parseInt(setting.ParameterIndex)
					&& self.configurationSettings[i].ItemName.toLowerCase() === setting.ItemName.toLowerCase())
				{
					self.configurationSettings[i].ItemValue = setting.ItemValue;
					foundIt = true;
					self.logDebug('updateSetting', 'setting was found and updated', setting);
				}
			}

	
			//if the setting doesn't exist, add it
			if(!foundIt)
			{
				setting.ConfigurationID = self.currentConfiguration;
				setting.ConfigurationName = self.currentConfigurationName;
				self.configurationSettings.push(setting);
				self.logDebug('updateSetting', 'setting was not found and was added', setting);
			}

			self.emit('settingUpdated', setting);
			return true;
		}
		catch(err)
		{
			self.onError('updateSetting', err.message, err);
			return false;
		}
	};

		/**
	 * Gets a list of configurations to display to user under tabbed option page
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&username=mvorkapich&pcname=1234&applicationname=CalRun&connection=calibration&storedProcedure=getConfigurationAreas
	 * Function Type: Async
	 * 
	 * @param {integer} systemID - The ID of the system to ignore (current system)
	 * @param {function} callback - function to be called when this is done
	 */
		 self.getConfigurationAreas = function(callback)
		 {
			 try
			 {
	 
				 let parameters = {
					 debug: self.debugFlag,
					 dostuff: 'RunStoredProcedure',
					 connection: 'calibration',
					 storedProcedure: 'GetConfigurationAreas'
				 };
	 
				 self.logDebug('getExternalConfigurations', 'parameters', parameters);
	 
				 ProcessDatabaseRequest(parameters, function(data)
				 {
					 self.configurationAreasRetrieved(data, callback);
				 });
			 }
			 catch(err)
			 {
				 self.onError('getExternalConfigurations', err.message, new Error());
				 return false;
			 }
		 };

		 	/**
	 * When the selected configuration settings have been retrieved
	 * Updates the configuration settings object
	 * Function Type: Sync
	 * 
	 * @param {string} data - JSON encoded string
	 * @param {function} callback - function to be called
	 * @returns {boolean} were the settings retrieved successfully?
	 */
	self.configurationAreasRetrieved = function(data, callback)
	{
		try
		{
			if(isJson(data))
			{
				//when the configuration settings are retrieved
				//put them in the settings list
				self.configurationTabs = JSON.parse(data);

				self.logDebug('tab data retrieved', 'configuration areas retrieved successfully', data);
				executeCallback(callback, self.configurationAreasRetrieved);
				self.emit('configurationAreas', self.configurationAreasRetrieved);

				//TODO: remove this line
				//console.warn(self.configurationTabs);
			}
			else
			{
				let errorMessage = processDatabaseError(data);
				if(errorMessage === null)
				{
					self.onError('configurationAreasRetrieved', 'Unable to process database response: ' + data, new Error());
					return false;
				}
				self.processError(errorMessage.Class, errorMessage.Function, errorMessage.Message, new Error());
				return false;
			}
			return true;

		}
		catch(err)
		{
			self.onError('configurationAreasRetrieved', err.message, err);
			return false;
		}
	};

	/**
	 * Gets a list of configurations from other calibration systems so they can be imported into this one
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=RunStoredProcedure&username=mvorkapich&pcname=1234&applicationname=CalRun&connection=calibration&storedProcedure=GetExternalConfigurations&configurationID=35
	 * Function Type: Async
	 * 
	 * @param {integer} systemID - The ID of the system to ignore (current system)
	 * @param {function} callback - function to be called when this is done
	 */
	self.getExternalConfigurations = function(systemID, callback)
	{
		try
		{
			if(isPositiveInteger(systemID) === false)
			{
				self.onError('getExternalConfigurations', 'System ID must be a positive integer, received ' + systemID, new Error());
				return false;
			}

			let parameters = {
				debug: self.debugFlag,
				dostuff: 'RunStoredProcedure',
				connection: 'calibration',
				storedProcedure: 'GetExternalConfigurations',
				systemID: systemID
			};

			self.logDebug('getExternalConfigurations', 'parameters', parameters);

			ProcessDatabaseRequest(parameters, function(data)
			{
				self.externalConfigurationsRetrieved(data, callback);
			});
		}
		catch(err)
		{
			self.onError('getExternalConfigurations', err.message, new Error());
			return false;
		}
	};

	/**
	 * When external configurations have been retrieved
	 * Simply notifies the world that they are here
	 * 
	 * @param {string} data - JSON encoded string
	 * @param {function} callback - function to be called
	 * @returns {boolean} were the configurations retrieved successfully?
	 */
	 self.externalConfigurationsRetrieved = function(data, callback)
	 {
		try
		{
			if(isJson(data))
			{
				let externalConfigurations = JSON.parse(data);
				self.logDebug('exteranlConfigurationsRetrieved', 'Configurations retrieved successfully', data);

				executeCallback(callback, externalConfigurations);
				self.emit('externalConfigurationsRetrieved', externalConfigurations);
			}
			else
			{
				let errorMessage = processDatabaseError(data);
				if(errorMessage === null)
				{
					self.onError('externalConfigurationsRetrieved', 'Unable to process database response: ' + data, new Error());
					return false;
				}
				self.processError(errorMessage.Class, errorMessage.Function, errorMessage.Message, new Error());
				return false;
			}
			return true;
		}
		catch(err)
		{
			self.onError('externalConfigurationsRetrieved', err.message, err);
			return false;
		}
	 };

	/**
	 * Saves the configuration settings. but only the ones in the configuration area specified
	 * Test URL: http://localhost/sbGlobal/sbDatabaseFunctions.php?debug=true&dostuff=SaveCalibrationSystemSettings&values=[{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%220%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Device%20Type%22,%22ItemValue%22:%22System%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%220%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Model%22,%22ItemValue%22:%22SparkFun%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%220%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22SN%22,%22ItemValue%22:%228888%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%220%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Measurand%22,%22ItemValue%22:%22Not%20Set%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%220%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Target%20Value%22,%22ItemValue%22:%221,%2010000%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%220%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22Device%20Type%22,%22ItemValue%22:%22Reference%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%220%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22Model%22,%22ItemValue%22:%22SNTL%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%220%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22SN%22,%22ItemValue%22:%2230%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%220%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22Measurand%22,%22ItemValue%22:%22Phenanthrene%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%220%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22Target%20Value%22,%22ItemValue%22:%22100%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%221%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Device%20Type%22,%22ItemValue%22:%22Reference%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%221%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Model%22,%22ItemValue%22:%22SNTL%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%221%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22SN%22,%22ItemValue%22:%2230%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%221%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Measurand%22,%22ItemValue%22:%22Phenanthrene%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%221%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Target%20Value%22,%22ItemValue%22:%221000%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%221%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22Device%20Type%22,%22ItemValue%22:%22System%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%221%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22Model%22,%22ItemValue%22:%22SparkFun%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%221%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22SN%22,%22ItemValue%22:%228888%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%221%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22Measurand%22,%22ItemValue%22:%22Not%20Set%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%221%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22Target%20Value%22,%22ItemValue%22:%221,%201000%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%222%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Device%20Type%22,%22ItemValue%22:%22Reference%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%222%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Model%22,%22ItemValue%22:%22SNTL%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%222%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22SN%22,%22ItemValue%22:%2230%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%222%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Measurand%22,%22ItemValue%22:%22Phenanthrene%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%222%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Target%20Value%22,%22ItemValue%22:%2210000%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%222%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22Device%20Type%22,%22ItemValue%22:%22System%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%222%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22Model%22,%22ItemValue%22:%22SparkFun%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%222%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22SN%22,%22ItemValue%22:%228888%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%222%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22Measurand%22,%22ItemValue%22:%22Not%20Set%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%222%22,%22ParameterIndex%22:%221%22,%22ItemName%22:%22Target%20Value%22,%22ItemValue%22:%221,%201000%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%223%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Device%20Type%22,%22ItemValue%22:%22Reference%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%223%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22Model%22,%22ItemValue%22:%22SNTL%22},{%22ConfigurationID%22:%22999999%22,%22ConfigurationName%22:%22default%22,%22ConfigurationArea%22:%22dataPoint%22,%22OptionIndex%22:%223%22,%22ParameterIndex%22:%220%22,%22ItemName%22:%22SN%22,%22ItemValue%22:%2230%22}]
	 * Function Type: Async
	 * 
	 * @param {array} settings - array of settings objects. See validateSetting for an example object
	 * @param {function} callback - function to be triggered after the settings are saved
	 */
	self.saveConfiguration = function(settings, callback)
	{
		try
		{
			if(Array.isArray(settings) === false || settings.length === 0)
			{
				self.onError('saveConfiguration', 'No settings passed in', new Error());
				return false;
			}

			//if there is only one setting, we will assume we just want to add it to the list of settings
			//this supports the idea of saving a setting immediately when the value changes
			if(settings.length === 1)
			{
				self.updateSetting(settings[0]);
				self.logDebug('saveConfiguration', 'only one setting found, updated and being saved', settings);
			}
			else
			{
			//if there are multiple settings, then replace them all
			//this supports the idea of saving when a dialog is closed
				self.clearSettings(settings[0].ConfigurationArea);
				self.addSettings(settings);
				self.logDebug('saveConfiguration', 'multiple settings found, replacing old settings', settings);
			}

			settings = self.getConfigurationByArea(settings[0].ConfigurationArea);

			let parameters = {
				dostuff: 'SaveCalibrationSystemSettings',
				debug: self.debugFlag,
				values: settings,
				applicationname: self.applicationName,
				username: self.userName,
				pcname: self.pcName
			};
			
			//####### daveg ########
					console.warn(parameters);
			//### delete at will ###
			

			self.logDebug('saveConfiguration', 'parameters', parameters);

			ProcessDatabaseRequest(parameters, function(data)
			{
				self.configurationSaved(data, callback);
			});
		}
		catch(err)
		{
			self.onError('saveConfiguration', err.message, err);
		}
	};

	/**
	 * When the configuration settings have been saved
	 * Doesn't make any changes to the system, just notifies 
	 * the systems that the save happened
	 * Function Type: Sync
	 * 
	 * @param {string} data - JSON encoded string
	 * @param {function} callback - function to be called
	 * @returns {boolean} were the settings saved successfully?
	 */
	self.configurationSaved = function(data, callback)
	{
		try
		{
			if(isJson(data))
			{
				let response = JSON.parse(data);
				executeCallback(callback, response[0]);
				self.emit('configurationSaved', response[0]);
				self.logDebug('configurationSaved', 'configuration saved successfully', response);
			}
			else
			{
				let errorMessage = processDatabaseError(data);
				if(errorMessage === null)
				{
					self.onError('configurationSaved', 'Unable to process database response: ' + data, new Error());
					return false;
				}
				self.processError(errorMessage.Class, errorMessage.Function, errorMessage.Message, new Error());
				return false;
			}
			return true;

		}
		catch(err)
		{
			self.onError('configurationSaved', err.message, err);
			return false;
		}
	};

	/**
	 * One level deeper of filtering. By configuration area and item name
	 * Case insensitive
	 * Function Type: Sync
	 * 
	 * @param {string} configurationArea - must match the configuration area in the object
	 * @param {string} itemName - must match the item name in the object
	 * @return {array} - an array that contains the results. If no results are found, the array will be empty
	 */
	self.getConfigurationByParameters = function(configurationArea, itemName)
	{
		try
		{
			if(!configurationArea || !itemName)
			{
				self.onError('getConfigurationByParameters', 'Must pass in configuration area and item name.', new Error());
				return false;
			}
			return self.configurationSettings.filter(function(setting)
			{
				return setting.ConfigurationArea.toLowerCase() === configurationArea.toLowerCase() && setting.ItemName.toLowerCase() === itemName.toLowerCase();
			});
		}
		catch(err)
		{
			self.onError('getConfigurationByParameters', err.message, err);
			return false;
		}
	};

	/**
	 * !This should eventually be moved to sbGlobalFunctions
	 * For notifying processes of errors that happened
	 * This can be used for internal or external errors
	 * Function Type: Async
	 * 
	 * @param {string} className - the name of the class that had an error
	 * @param {string} methodName - the name of the function that had an error
	 * @param {string} errorMessage - the contents of the error message
	 */
	self.processError = function(className, methodName, errorMessage, stackTrace)
	{

		let parameters = {
			class: className,
			method: methodName,
			message: errorMessage
		};

		let displayMessage = 'Error!\r\n' +
			'Class: ' + className + '\r\n' + 
			'Method: ' + methodName + '\r\n' + 
			'Message: ' + errorMessage;

		if(stackTrace)
		{
			let lineNumber = stackTrace.stack.split('\n')[0];
		
			while(lineNumber.indexOf('.js') > -1)
			{
				lineNumber = lineNumber.substring(lineNumber.indexOf('.js:') + 4);
			}
	
			lineNumber = lineNumber.substring(0, lineNumber.indexOf(':'));

			parameters.lineNumber = lineNumber;
			displayMessage += '\r\nLine Number: ' + lineNumber;
		}
		
		console.error(displayMessage);

		self.emit('error', parameters);
	};

	/**
	 * For notifying processes of errors that happened
	 * This is for internal errors
	 * We assume the class is the current one
	 * Function Type: Sync
	 * 
	 * @param {string} methodName - the name of the function that had an error
	 * @param {string} message - the contents of the error message
	 */
	self.onError = function(methodName, errorMessage, stackTrace)
	{
		self.processError('ConfigurationManager', methodName, errorMessage, stackTrace);
	};

	/**
	 * For sending debug messages to the system, if anything is listening
	 * 
	 *	@param {string} methodName - name of the function sending a debug message
	 * 	@param {string} message - text portion of the message to be sent
	 *  @param {object} parameters - any additional information that will be sent along 
	 */
	self.logDebug = function(methodName, message, parameters)
	{
		let debugObject = {
			class: 'ConfigurationManager',
			method: methodName,
			message: message,
			parameters: 'none'
		};

		if(typeof parameters !== 'undefined')
		{
			if(isJson(parameters))
			{
				debugObject.parameters = parameters;
			}
			else
			{
				debugObject.parameters = JSON.stringify(parameters);
			}
		}

		self.emit('debug', debugObject);
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
