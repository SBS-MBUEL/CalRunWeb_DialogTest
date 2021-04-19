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

const popUpSelection = function(domElement) {
    console.log($(domElement).parent());
    // TODO: Implement listener
    // TODO: Propagate selection back to state of React object 
    // TODO: Make inserted pop up customizable
    return $(domElement).parent().append('<div class="miniPopUp">test</div>');
    
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

class InputRow extends React.Component {

    render() {
        const {content, index} = this.props;

        return (
            <div key={index} className={`input ${content.id}`}>
                <div className="pl-1 row mb-1 content">
                    {content.inputRow.length > 0 ? content.inputRow.map((input, index) => {
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
                                    <div 
                                        className={input.className}>
                                            {input.subContent.map((sub, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`col-${input.colSize}`}>
                                                            <div
                                                                onClick={this.props.addRow} 
                                                                className={sub.className}>
                                                                    <i
                                                                        className={sub.subClassName}
                                                                        aria-hidden="true">{sub.textContent}</i>
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
class ConfigContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs : props.tabs,
            tabContent : props.tabContent
        }

        this.changeHandler = this.changeHandler.bind(this);
        this.insertRow = this.insertRow.bind(this);
    }

    /**
     * deals with changes to UI to make sure they are saved to the state
     * @param {Event} e 
     */
    changeHandler(e) {
        console.log('changeHandler');
        console.log(e);
        popUpSelection(e.currentTarget);

    }

    insertRow(e) {
        console.log('insertRow');
        console.log(e.currentTarget);
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
                                            className={`tab-pane active fade in ${i === 0 ? 'show' : ''}`}  
                                            id={`${content.id}`}
                                        >
                                            <HeaderRow index={i} content={content} />
                                            <InputRow handler={this.changeHandler} addRow={this.insertRow} index={i} content={content} />
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
            } else {
                el.classList && el.classList.remove('active');
            }
        });
    });

}
  