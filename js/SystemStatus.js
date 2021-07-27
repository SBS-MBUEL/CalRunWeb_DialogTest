'use strict';

function SystemStatus(container, controlObjects)
{
	let self = this;
	self.listener = new SBListener();
	self.emit = self.listener.emit;
	self.on = self.listener.on;
	self.ReferenceArea = new ReferenceArea(controlObjects.parameters);
	self.StatusArea = new StatusArea(controlObjects.statusItems);
	self.ControlArea = new ControlArea(controlObjects.controlItems);

	self.ControlArea.on('click', function(data)
	{
		self.emit('click', data);
	});

	self.BuildSystemStatus = function()
	{
		let table = document.createElement('table');
		table.style.width = '100%';
		let row = table.insertRow();
		let cell = row.insertCell();
		cell.appendChild(self.ReferenceArea.grid);
		cell.style.verticalAlign = 'top';
		cell.style.width = '50%';
		cell = row.insertCell();
		cell.appendChild(self.StatusArea.grid);
		cell.style.verticalAlign = 'top';
		cell.style.width = '30%';
		cell = row.insertCell();
		cell.appendChild(self.ControlArea.grid);
		cell.style.verticalAlign = 'top';
		cell.style.width = '20%';
		return table;
	};

	self.setValue = function(functionalArea, parameterName, valueType, value)
	{
		if(functionalArea.toLowerCase() === 'reference')
		{
			self.ReferenceArea.setValue(parameterName, valueType, value);
		}
		if(functionalArea.toLowerCase() === 'status')
		{
			self.StatusArea.setValue(parameterName, value);
		}
		if(functionalArea.toLowerCase() === 'control')
		{
			self.ControlArea.setValue(parameterName, value);
		}
	};

	self.getValue = function(functionalArea, parameterName)
	{
		if(functionalArea.toLowerCase() === 'control')
		{
			return self.ControlArea.getValue(parameterName);
		}
	};

	document.getElementById(container).appendChild(self.BuildSystemStatus());
}

function ReferenceArea(parameters)
{
	let self = this;
	self.listener = new SBListener();
	self.emit = self.listener.emit;
	self.on = self.listener.on;
	self.parameters = parameters;
	self.headers = ['Parameters', 'Units', 'Converted', 'Raw', 'COV', 'Stable'];
	self.grid = null;

	self.buildReferenceArea = function()
	{
		let table = document.createElement('table');
		table.style.width = '100%';
		table.style.height = '100%';
		table.style.border = 'none';
		table.style.borderCollapse = 'collapse';		
		let headerRow =  table.insertRow();
		headerRow.className = 'selectorHeaderRow';

		self.headers.forEach(function(header)
		{
			let th = document.createElement('th');
			th.appendChild(document.createTextNode(header));
			th.className = 'selectorHeaderCell';
			headerRow.appendChild(th);
		});

		self.grid = table;
		self.addRows(self.parameters);
	};

	self.clearRows = function()
	{
		while(self.grid.rows.length > 1)
		{
			self.grid.deleteRow(1);
		}
		self.parameters = [];
	};

	self.addRows = function(rowLabels)
	{
		rowLabels.forEach(function(rowLabel)
		{
			let row = self.grid.insertRow();
			row.className = 'selectorRow';
			self.headers.forEach(function()
			{
				let cell = row.insertCell();
				cell.innerHTML = '&nbsp;';
				cell.className = 'selectorCell';
			});
			row.cells[0].innerHTML = rowLabel;
			if(self.grid.rows.length % 2 === 0)
			{
				row.className = 'selectorAlternatingRow';
			}
			self.parameters.push(rowLabel);
		});
	};

	self.setValue = function(parameterName, valueType, value)
	{
		let parameterIndex = self.parameters.indexOf(parameterName);
		let valueIndex = self.headers.indexOf(valueType);
		self.grid.rows[parameterIndex + 1].cells[valueIndex].innerHTML = value;
	};

	self.getValue = function(itemName, parameterName)
	{

	};

	self.buildReferenceArea();

}

function StatusArea(statusItems)
{
	let self = this;
	self.listener = new SBListener();
	self.emit = self.listener.emit;
	self.on = self.listener.on;
	self.items = statusItems;
	self.headers = ['Item', 'Status'];
	self.grid = null;

	self.buildStatusArea = function()
	{
		let table = document.createElement('table');
		table.style.width = '100%';
		table.style.height = '100%';
		table.style.border = 'none';
		table.style.borderCollapse = 'collapse';		
		let headerRow =  table.insertRow();
		headerRow.className = 'selectorHeaderRow';

		self.headers.forEach(function(header)
		{
			let th = document.createElement('th');
			th.appendChild(document.createTextNode(header));
			th.className = 'selectorHeaderCell';
			headerRow.appendChild(th);
			if(header === 'Item')
			{
				th.style.width = '150px';
			}
		});

		for(let i = 0; i < self.items.length; i++)
		{
			let row = table.insertRow();
			row.className = 'selectorRow';
			self.headers.forEach(function(header)
			{
				let cell = row.insertCell();
				cell.innerHTML = '&nbsp;';
				cell.className = 'selectorCell';
			});
			if(i % 2 === 0)
			{
				row.className = 'selectorAlternatingRow';
			}
			row.cells[0].innerHTML = self.items[i];
		}

		self.grid = table;
	};

	self.setValue = function(itemName, value)
	{
		let itemIndex = self.items.indexOf(itemName);
		if(itemIndex > -1)
		{
			self.grid.rows[itemIndex + 1].cells[1].innerHTML = value;
		}
	};

	self.getValue = function(itemName, parameterName)
	{

	};

	self.buildStatusArea();

	setInterval(function()
	{
		let today = new Date();
		let dateTime = today.toLocaleString('en-US');
		self.setValue('Current Time', dateTime);
	}, 1000);

}

function ControlArea(controlItems)
{
	let self = this;
	self.listener = new SBListener();
	self.emit = self.listener.emit;
	self.on = self.listener.on;
	self.items = controlItems;
	self.headers = ['Control', 'Status'];
	self.grid = null;

	self.buildControlArea = function()
	{
		let table = document.createElement('table');
		table.style.width = '100%';
		table.style.height = '100%';
		table.style.border = 'none';
		table.style.borderCollapse = 'collapse';		
		let headerRow =  table.insertRow();
		headerRow.className = 'selectorHeaderRow';

		self.headers.forEach(function(header)
		{
			let th = document.createElement('th');
			th.appendChild(document.createTextNode(header));
			th.className = 'selectorHeaderCell';
			headerRow.appendChild(th);
			if(header === 'Control')
			{
				th.style.width = '150px';
			}
		});

		for(let i = 0; i < self.items.length; i++)
		{
			let row = table.insertRow();
			row.className = 'selectorRow';
			self.headers.forEach(function(header)
			{
				let cell = row.insertCell();
				cell.innerHTML = '&nbsp;';
				if(header === 'Control')
				{
					cell.className = 'controlCell';
				}
				else
				{
					cell.className = 'selectorCell';
				}
				
			});
			if(i % 2 === 0)
			{
				row.className = 'selectorAlternatingRow';
			}
			let item = document.createElement('span');
			item.innerHTML = self.items[i];
			item.addEventListener('click', function(event)
			{
				self.emit('click', event.target.innerHTML);
			});
			row.cells[0].appendChild(item);
		}

		self.grid = table;
	};

	self.setValue = function(itemName, value)
	{
		let itemIndex = self.items.indexOf(itemName);
		self.grid.rows[itemIndex + 1].cells[1].innerHTML = value;
		if(value === true || (typeof value === 'string' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'on' || value.toLowerCase() === 'open')))
		{
			self.grid.rows[itemIndex + 1].cells[1].className = 'selectorCellTrue';
		}
		else if(value === false || (typeof value === 'string' && (value.toLowerCase() === 'false' || value.toLowerCase() === 'off' || value.toLowerCase() === 'closed')))
		{
			self.grid.rows[itemIndex + 1].cells[1].className = 'selectorCellFalse';
		}
	};

	self.getValue = function(itemName)
	{
		let itemIndex = self.items.indexOf(itemName);
		let value = self.grid.rows[itemIndex + 1].cells[1].innerHTML;
		return value;
	};

	self.buildControlArea();
}