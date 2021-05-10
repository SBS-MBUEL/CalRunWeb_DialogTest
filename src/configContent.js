// Production version of code needs this remarked out

// TODO: try traditional require?
// TODO: check if React module is loaded before importing?
// import React from 'react';
// import createGUID from './utils/createGUID';


/**
 * renders TabMenu - this is the tab menu bar across top of setup (configuration) page
 * //TODO: on click events implemented here
 */
class TabMenu extends React.Component {
    render() {
        const {tab, index} = this.props;

        return (
            <li 
                key={createGUID()} 
                className={(index === 0 ? 'tab-select active' : 'tab-select')} 
                role="presentation">
                <a href={`#${tab.ConfigurationArea}`} aria-controls="home" role="tab" data-toggle="tab" aria-expanded="true">
                    <i className={`${tab.Icon}`}></i> 
                    {tab.ConfigurationArea}
                </a>
            </li>
            );
    }
}

/**
 * ConfigPageRow - renders each row of the config page
 * setup in a "key/value" pair arrangement - pop ups are still generic, need to be mapped to an object
 */
class ConfigPageRow extends React.Component {
    render() {
        const { row, index } = this.props;
        return (
            <div key={createGUID()} className="pl-1 content row font-weight-bold">
                <div key={createGUID()} className={`heading col-6 text-right`}>
                    {row.ItemName}
                </div>
                <div key={createGUID()} className={`col-6 text-left`}>
                    <div className="dropright">
                        <span className={`dropdown-toggle`} data-toggle="dropdown">{row.ItemValue}</span>
                        <ul className="miniPopUp dropdown-menu">
                            <div className="drop-container">
                                {/* Need to figure out how to populate this with actual data */}
                                {['test1', 'test2', 'test3', 'test4'].map((item, i) => {
                                    return (
                                        <li 
                                            key={createGUID()} 
                                            onClick={this.props.handler} 
                                            className={`btn btn-outline-primary popup-link`}>
                                                {item}
                                        </li>
                                    );
                                })}
                            </div>
                        </ul>
                    </div>
                </div>
            </div>  
        );
    }
}

/**
 * ConfigurationDisplayHeading - renders title heading of each tab and the control buttons
 */
class ConfigurationDisplayHeading extends React.Component {

    
    render() {
        const { heading, handler } = this.props;

        // this should likely come from an external source
        const buttonMap = [
            {
                type: "success",
                icon: "plus",
                text: "ADD"
            },
            {
                type: "warning",
                icon: "copy",
                text: "COPY"
            },
            {
                type: "info",
                icon: "save",
                text: "SAVE"
            },
            {
                type: "danger",
                icon: "remove",
                text: "REMOVE"
            },
        ]

        return (
            <React.Fragment>
                <div key={createGUID()} className="row">
                    <div className="col-12">
                        <h1  className="pl-1 text-center">{heading}</h1>
                    </div>
                </div>
                <div key={createGUID()} className="row pb-1">
                    {buttonMap.map((el, index) => {
                        return (
                            <div key={createGUID()} className={`col-3`}>
                                <div
                                    onClick={handler} 
                                    className={`btn btn-${el.type} fa fa-${el.icon}`}
                                >
                                    &nbsp;{el.text}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </React.Fragment>
        )
    }
}

/**
 * SubOptions - this is the inner panel that displays a sliding tab for those options
 */
class SubOptions extends React.Component {

    constructor(props) {
        super(props);
        this.setDots = this.setDots.bind(this);
    }

    /**
     * slides the sub panel to the right
     * @param {string} page name of current page to be manipulated
     */
    slideRight(page) {
        let currentSlide = 0;
        const maxSlides = $(`#sub-${page} .slide`).length;
        $(`#sub-${page} .slide`).each((i, el) => {
            let currentPosition = $(el).attr('style');
            currentPosition = Number(currentPosition.match(/\d/));
            
            if (currentPosition < maxSlides - 1) {
                currentPosition *= -1;
                currentPosition -= 1;
            } else {
                currentPosition = 0;
            }
            currentSlide = currentPosition * -1;
            currentPosition *= 100
            $(el).attr('style', `transform: translateX(${currentPosition}%)`);

        });
        this.setDots(page, currentSlide);
    }

    /**
     * slides current pane to the left
     * @param {string} page 
     */
    slideLeft(page) {
        let currentSlide = 0;
        const maxSlides = $(`#sub-${page} .slide`).length;
        $(`#sub-${page} .slide`).each((i, el) => {
            let currentPosition = $(el).attr('style');
            currentPosition = Number(currentPosition.match(/\d/));
            
            if (currentPosition > 0) {
                currentPosition *= -1;
                currentPosition += 1;
            } else {
                currentPosition = maxSlides - 1;
                currentPosition *= -1;
            }
            currentSlide = currentPosition * -1;
            currentPosition *= 100;
            $(el).attr('style', `transform: translateX(${currentPosition}%`);
        });
        this.setDots(page, currentSlide);
    }

    /**
     * sets the active dot to the matching slide
     * @param {string} page name
     * @param {number} slide index of currently displayed slide
     */
    setDots(page, slide) {
        document.querySelectorAll(`#sub-${page} .fa-circle`).forEach(el => {
            el.classList.remove('active--dot');
            el.classList.add('inactive--dot');
        })

        document.querySelectorAll(`#sub-${page} .fa-circle`)[slide].classList.remove('inactive--dot');
        document.querySelectorAll(`#sub-${page} .fa-circle`)[slide].classList.add('active--dot');
    }

    render() {
        const { subOption, page } = this.props;

        let currentRow = 0

        return (
            <React.Fragment>
                <div id={`sub-${page}`} className="container-fluid">
                        {/* increment through options */}
                        <div key={createGUID()} className="row flex-nowrap pt-2 pr-3">
                        {subOption.map((optionTab, index) => {
                            return (
                                <React.Fragment>
                                    <div  className="slide col-12 position-relative col-overflow" style={{"transform": "translateX(0%)"}}>
                                        {optionTab.map((row, index) => {
                                            return <ConfigPageRow row={row} index={index} />;
                                        })}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        </div>
                    {/* TODO: Don't like styling of these  */}
                    {/* TODO: Make sure they only display if the instrument has sub configs - makes a tab confusing */}
                    {(subOption.length > 1 ? 
                        <React.Fragment>
                            <button onClick={this.slideLeft.bind(this, page)} className="slider__btn slider__btn--left"><span className="fa fa-arrow-left"></span></button>
                            <button onClick={this.slideRight.bind(this, page)} className="slider__btn slider__btn--right"><span className="fa fa-arrow-right"></span></button>
                            <div className="dots">
                                {subOption.map((pane, index) => {
                                    return (
                                        <span className={`${(index === 0) ? 'active' : 'inactive'}--dot fa fa-circle`}></span>
                                    );

                                })}
                            </div>
                        </React.Fragment>
                    :
                        <React.Fragment>
                            {subOption.map((_, index) => {
                                return (
                                    <span className={`${(index === 0) ? 'active' : 'inactive'}--dot fa fa-circle`}></span>
                                );

                            })}
                        </React.Fragment>
                    )}

                </div>
            </React.Fragment>
        );
    }
}

class ConfigurationSetup extends React.Component {
    render() {
        const {content, index, handler} = this.props;
        console.warn('content');
        console.table(content);

        const staticSettings = content.slice().filter((a,b) => a.ParameterIndex === '-1' && a.OptionIndex === '0').filter((a, b) => a !== undefined);   

        
        let extraConfig = [];
        let rowCount = 0;
        let moreRows = true

        // extract settings "rows" (needs a better term) to display
        while(moreRows) {

            let currentRow = content.map((el) => {
                if(el.OptionIndex == rowCount && !(el.ParameterIndex === '-1' && el.OptionIndex === '0')) {

                    return el;
                }
            }).filter((a,b) => a !== undefined);

            if (currentRow.length === 0) {
                moreRows = false;
            } else {
                extraConfig.push(currentRow);
            }
            rowCount++;

        }

        console.warn('extra config:');
        console.dir(extraConfig);

        let display = <p>no content</p>;
        display = display && content[0] &&  content[0].ConfigurationArea && (
                <div key={createGUID()} className="container-fluid">
                    <ConfigurationDisplayHeading handler={handler} heading={content[0].ConfigurationArea.toUpperCase()}/>
                    {staticSettings.map((row, index) => {

                        return (
                            <ConfigPageRow row={row} index={index} />
                        )
                    })}
                    <hr />
                    {extraConfig.length > 0 ?
                        <SubOptions subOption={extraConfig} page={content[0].ConfigurationArea}/>
                        :
                        <React.Fragment>
                            {/* Empty div to display nothing */}
                        </React.Fragment>
                    }
                    {/* {rows.length > 0 ? rows.map((col, index) => <SubOptions />) : <p>No configs below this.</p>} */}
                </div>);
        return (
            <React.Fragment>
                {display}
            </React.Fragment>
        );
    }
}

class DropDownList extends React.Component {
    render() {
        console.log('hello', this.props.ddContent);
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }
}

/**
 * ConfigContainer is the main launching point to construct the tabbed configuration screen
 */
class ConfigContainer extends React.Component {
    constructor(props) {
        super(props);
        // TODO: state variable needs to contain settings object to be manipulated when an option is changed.
        if(props.tabs && props.tabs.length > 0) {
            this.state = {
                tabs : props.tabs
                .filter(el => el != undefined),
                // .filter(el => el.ConfigurationArea === 'system')
                content : props.settings.map(cur => {
                        if (props.tabs.reduce((acc, tab) => tab.ConfigurationArea.toLowerCase() === cur.ConfigurationArea.toLowerCase() ? acc + 1 : acc, 0) > 0) {
                            return cur;
                        }
                    })
                    .filter(el => el != undefined),
                    // .filter(el => el.ConfigurationArea === 'system')
                    // .filter(el => Number(el.ParameterIndex) >= 0)
                settings: props.settings
            };
        } else {
            console.error('no config tabs defined');
            this.state = {
                tabs : [],
                settings: props.settings
            };
        }
        console.log(this.state);
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

    }

    /**
     * deals with changes to UI to make sure they are saved to the state
     * //TODO: need to implement code here to deal with changes to selected item
     * @param {Event} e 
     */
    changeHandler(e) {
        console.log('changeHandler');
        console.log(e.currentTarget.textContent);

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

        if ($(e.currentTarget)[0].className.includes('popup-link')) {
            this.changeHandler(e);
        }
        else if ($(e.currentTarget)[0].className.includes('success')) {
            this.insertRow(e);
        }
        else if ($(e.currentTarget)[0].className.includes('danger')) {
            this.removeRow(e);
        }
        else if ($(e.currentTarget)[0].className.includes('info')) {
            this.updateRow(e);
        }
        else if ($(e.currentTarget)[0].className.includes('warning')) {
            this.copyRow(e);
        }
        else if ($(e.currentTarget)[0].className.includes('primary')) {
            this.changeHandler(e);
        }
    }

    render() {
        const { tabs, content } = this.state;

        return (
            <div className="container-fluid text-center">
                <div className="row">
                    <div className="pt-4 col-12">
                        <div className="tab" role="tabpanel">
                            <ul className="nav nav-tabs" role="tablist">
                                {
                                    tabs.length > 0 ? 
                                        tabs.map((tab, i) => {
                                            return <TabMenu index={i} tab={tab} />
                                        }) : 
                                            <p>no tabs to select</p>
                                }
                            </ul>   
                            <div className="tab-content tabs">
                                { /* TODO: this is where we will map the data */ }
                                { 
                                    tabs.length > 0 ? 
                                        tabs.map((tab, i) => {
                                            return (
                                                <div 
                                                    key={createGUID()} 
                                                    role="tabpanel" 
                                                    className={`tab-pane ${i === 0 ? 'fade in active show' : 'fade out inactive'}`}  
                                                    id={`${tab.ConfigurationArea}`}
                                                >
                                                    <ConfigurationSetup 
                                                        index={i} 
                                                        content={content.filter(cnt => {
                                                            if (!cnt && !cnt.ConfigurationArea) {
                                                                return -1;
                                                            }
                                                            return cnt.ConfigurationArea.toUpperCase() === tab.ConfigurationArea.toUpperCase()
                                                        })}
                                                        handler={this.clickRouter}
                                                    />
                                                </div>
                                            )
                                        }) 
                                    : 
                                        <p>no inner to display!</p>
                                }
                                        
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
 * // TODO: need other params listed here
 * // TODO can tab control be moved inside of react object?
 * @param {DOM} root element to render content to
 */
function renderConfig(root, tabNames, configuration) {

    ReactDOM.render(
    <ConfigContainer 
        tabs={tabNames} 
        settings={configuration}/>,
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


/**
 * Code to make these functions visible in NODE.JS for testing
 * module.exports is Node specific so we need to test for it's existence
 */
 if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
 {
     module.exports = 
     {
         ConfigContainer: ConfigContainer

     };
 }