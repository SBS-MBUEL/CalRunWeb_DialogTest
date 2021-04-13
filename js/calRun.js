/**
 * Controller for the actual calibration
 * Designed to have a replacable user interface
 * @param {boolean} isDebug 
 */
function CalRun(isDebug)
{
	let self = this;
	console.log('new cal run');
	self.listener = new SBListener();
	self.on = self.listener.on;
	self.emit = self.listener.emit;

	self.initialize = function()
	{
		try
		{
			self.emit('initializationComplete');
		}
		catch(err)
		{
			//do something
		}
	}
}