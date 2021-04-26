class ListMenu extends React.Component {
    render() {
        const {tab, index} = this.props;

        return (
            <li 
                key={index} 
                className={(index === 0 ? 'tab-select active' : 'tab-select')} 
                role="presentation">
                <a href={`#${tab.id}`} aria-controls="home" role="tab" data-toggle="tab" aria-expanded="true">
                    <i className={`${tab.classIcon}`}></i> 
                    {tab.name}
                </a>
            </li>
            );
    }
}



class HeaderRow extends React.Component {
    render() {
        const {content, index} = this.props;

        return (
            <React.Fragment>
                <h1 key={index} className="pl-1 text-center">{content.title}</h1>
                <div className="header ">
                    {/* {content.header.length} */}
                    <div className="pl-1 row heading font-weight-bold">
                        {(content.header.length > 0 ? content.header.map((header, index) => {
                            return (<div key={index} className={`col-${header.colSize}`}>
                                {header.textContent}
                            </div>);
                        }) : <p>no header cols</p>)}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

class ConfigRow extends React.Component {

    render() {
        const {content, index} = this.props;
        console.warn(content);
        return (
            <div key={index} className={`input ${content.id}`}>
                <div className="pl-1 row mb-1 content">
                    {content.length > 0 ? content.map((input, index) => {
                        return (
                            <div key={index} className={`col-${input.colSize}`}>
                                {(!input.subContent ? 
                                    React.createElement(input.element, {
                                        onClick: this.props.handler,
                                        key: index + 10,
                                        className: input.className,
                                    }, 
                                    input.textContent ) : 
                                    input.subContent.length > 0 ?
                                    <div className={input.className}>
                                        {input.subContent.map((col, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className={`col-${col.colSize}`}
                                                >
                                                    <div
                                                        onClick={this.props.handler} 
                                                        className={col.className}
                                                    >
                                                        <i
                                                            className={col.subClassName}
                                                            aria-hidden="true"
                                                        >
                                                            {col.textContent}
                                                        </i>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    : <p>no sub cols</p>)}
                            </div>
                        );
                    }) : <p>no header rows</p>}
                </div>
            </div>
        );
    }
}

/**
 * ConfigContainer is the main launching point to construct the tabbed configuration screen
 */
class ConfigContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs : props.tabs,
            tabContent : props.tabContent,
            dataRows: props.tabContent,
            newRowContent : []
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.insertRow = this.insertRow.bind(this);
        this.copyRow = this.copyRow.bind(this);
        this.updateRow = this.updateRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.clickRouter = this.clickRouter.bind(this);
    }

    /**
     * renders mini pop up option list - on change change calling div
     * @param {DOM} domElement Where the pop up dialog will appear
     * @param {string} id the DOM element to manipulate after selection is made
     * @returns 
     */
    popUpSelection(domElement, id) {
        console.log($(domElement).parent());
        // TODO: Implement listener
        // TODO: Propagate selection back to state of React object 
        // TODO: Make inserted pop up customizable
        // return $(domElement).parent().append('<div class="miniPopUp">test</div>').on('click', function(e) {
        //     console.log(e);
        // });
        renderPopUp(this.changeHandler, 'test', id)
    }

    /**
     * deals with changes to UI to make sure they are saved to the state
     * //TODO: need to implement code here to deal with changes to selected item
     * @param {Event} e 
     */
    changeHandler(e) {
        console.log('changeHandler');
        console.log(e);
        this.popUpSelection(e.currentTarget, e.currentTarget.id);

    }



    /**
    * copy current config row to a new row
    * //TODO: code needs implemented
    * @param {Event} e 
    */
    copyRow(e) {
        console.log('copy Row');
        console.log(e.currentTarget);
    }

    /**
    * update row of current config row to database and local configs
    * //TODO: code needs implemented
    * @param {Event} e 
    */
    updateRow(e) {
        console.log('update Row');
        console.log(e.currentTarget);
    }

    /**
     * insert new config row to table
     * //TODO: code needs implemented
     * @param {Event} e 
     */
    removeRow(e) {
        console.log('remove row');
        console.log(e.currentTarget);
    }

    /**
     * insert new config row to table
     * //TODO: code needs implemented
     * @param {Event} e 
     */
    insertRow(e) {
        console.log('insert Row');
        console.log(e.currentTarget);
    }

    clickRouter(e) {
        console.log('modify row - add / remove / update / copy');
        console.log($(e.currentTarget)[0]);

        if ($(e.currentTarget)[0].className.includes('controlLink')) {
            this.changeHandler(e);
        }
        if ($(e.currentTarget)[0].className.includes('success')) {
            this.insertRow(e);
        }
        if ($(e.currentTarget)[0].className.includes('danger')) {
            this.removeRow(e);
        }
        if ($(e.currentTarget)[0].className.includes('info')) {
            this.updateRow(e);
        }
        if ($(e.currentTarget)[0].className.includes('warning')) {
            this.copyRow(e);
        }
        if ($(e.currentTarget)[0].className.includes('primary')) {
            this.changeHandler(e);
        }
    }

    render() {
        const { tabs, tabContent } = this.state;
        console.log(tabContent);
        return (
            <div className="container-fluid text-center">
                <div className="row">
                    <div className="pt-4 col-12">
                        <div className="tab" role="tabpanel">
                            <ul className="nav nav-tabs" role="tablist">
                                {tabs.length > 0 ? tabs.map((tab, i) => {
                                    return <ListMenu index={i} tab={tab} />
                                }) : <p>no tabs to select</p>}
                            </ul>
                            <div className="tab-content tabs">
                                {/* this is where we wiil map the data */}
                                {tabContent.length > 0 ? tabContent.map((content, i) => {
                                    return (
                                        <div 
                                            key={i} 
                                            role="tabpanel" 
                                            className={`tab-pane ${i === 0 ? 'fade in active show' : 'fade out inactive'}`}  
                                            id={`${content.id}`}
                                        >
                                            <HeaderRow index={i} content={content} />
                                            <ConfigRow handler={this.clickRouter} index={i} content={content.inputRow} />
                                            {/* DONE: need to resolve what this data object will look like and change config data to appropriate value */}
                                            {/* DONE: Will need to iterate through configs for multiple rows, an additional map will need to be inserted here */}
                                            {content && content.dataRows.length > 0 && content.dataRows.map((row, i) => {
                                                return <ConfigRow handler={this.clickRouter} index={i} id={content.id} content={row} />
                                            })}
                                            
                                        </div>
                                    );
                                }) : <p>no content to display</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}


/**
 * Renders configuration from React classes declared above.
 * tabNames is a global located in tabConfig.js (edit ./dev version)
 * tabContent is a global located in tabContent.js (edit in ./dev version)
 * 
 * //TODO: load settings from LocalStorage (after they are saved) and then run background task to retrieve from database.
 * after creating tab config, it creates an event listener (used Jquery for speed of deploy) to listen to appropriate tab click and active/deactivate tabs.
 * 
 * //TODO: listen to config page closure to save settings to local storage and when avaialable the database.
 * @param {DOM} root element to render content to
 */
function renderConfig(root) {

    ReactDOM.render(
    <ConfigContainer 
        tabs={tabNames} 
        tabContent={tabContent}/>,
    document.getElementById(root)
    );
    
    $('.tab-select').on('click', function(e) {
        $('.tab-select').map((i, el) => {
            if (el === this) {
                el.classList && el.classList.add('active');
                el.classList && el.classList.remove('inactive');
            } else {
                el.classList && el.classList.remove('active');
                el.classList && el.classList.add('inactive');
            }
        });
    });

}
  