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

class ConfigScreen extends React.Component {
    render() {
        const { col, index } = this.props;
        return (
            <div key={createGUID()} className="pl-1 content row font-weight-bold">
                <div key={createGUID()} className={`heading col-6 text-right`}>
                    {col.ItemName}
                </div>
                <div key={createGUID()} className={`col-6 text-left`}>
                    <div className="dropright">
                        <span className={`dropdown-toggle`} data-toggle="dropdown">{col.ItemValue}</span>
                        <ul className="miniPopUp dropdown-menu">
                            <div className="drop-container">
                                {/* Need to figure out how to populate this with actual data */}
                                {['test1', 'test2', 'test3', 'test4'].map((item, i) => {
                                    return (
                                        <li 
                                            key={createGUID()} 
                                            onClick={this.props.handler} 
                                            className={`btn btn-outline-primary controlLink`}>
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

class ConfigurationDisplayHeading extends React.Component {


    render() {
        const { heading, handler } = this.props;

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <h1 key={createGUID()} className="pl-1 text-center">{heading}</h1>
                    </div>
                </div>
                <div className="row pb-1">
                    <div className={`col-3`}>
                        <div
                            onClick={handler} 
                            className="btn btn-success fa fa-plus"
                        >
                            &nbsp;ADD
                        </div>
                    </div>
                    <div className={`col-3`}>
                        <div
                            onClick={handler} 
                            className="btn btn-warning fa fa-copy"
                        >
                            &nbsp;COPY
                        </div>
                    </div>
                    <div className={`col-3`}>
                        <div
                            onClick={handler} 
                            className="btn btn-info fa fa-save"
                        >
                            &nbsp;SAVE
                        </div>
                    </div>
                    <div className={`col-3`}>
                        <div
                            onClick={handler} 
                            className="btn btn-danger fa fa-remove"
                        >
                            &nbsp;REMOVE
                        </div>
                    </div>
                </div>

            </React.Fragment>

        )
    }
}

class SubOptions extends React.Component {

    constructor(props) {
        super(props);
        this.setDots = this.setDots.bind(this);
    }

    slideRight(page) {
        let currentSlide = 0;
        const maxSlides = $(`#${page} .slide`).length;
        $(`#${page} .slide`).each((i, el) => {
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

    slideLeft(page) {
        console.log($(`#${page} > .slide`).length);
        let currentSlide = 0;
        const maxSlides = $(`#${page} .slide`).length;
        $(`#${page} .slide`).each((i, el) => {
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

    setDots(page, slide) {
        console.log(page, slide);
        
        document.querySelectorAll(`#${page} .fa-circle`).forEach(el => {
            console.log(el);
            el.classList.remove('active--dot');
            el.classList.add('inactive--dot');
        })

        document.querySelectorAll(`#${page} .fa-circle`)[slide].classList.remove('inactive--dot');
        document.querySelectorAll(`#${page} .fa-circle`)[slide].classList.add('active--dot');
    }

    render() {
        const { page } = this.props;

        return (
            <React.Fragment>
                <div id={page} className="container-fluid">

                    <div className="row flex-nowrap pt-2 no-gutters">
                        <div className="slide col-11 position-relative col-overflow" style={{"transform": "translateX(-100%)"}}>
                            <div className="row">
                                <div className="col-6">
                                    Key in tab 1
                                </div>
                                <div className="col-6">
                                    Value in tab 1
                                </div>
                            </div>
                        </div>
                        <div className="slide col-11 position-relative col-overflow" style={{"transform": "translateX(-100%)"}}>
                            <div className="row">
                                <div className="col-6">
                                    Key in tab 2
                                </div>
                                <div className="col-6">
                                    Value in tab 2
                                </div>
                            </div>
                        </div>
                        <div className="slide col-11 position-relative col-overflow" style={{"transform": "translateX(-100%)"}}>
                            <div className="row">
                                <div className="col-6">
                                    Key in tab 3
                                </div>
                                <div className="col-6">
                                    Value in tab 3
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* TODO: Don't like styling of these  */}
                    {/* TODO: Make sure they only display if the instrument has sub configs - makes a tab confusing */}
                    <button onClick={this.slideLeft.bind(this, page)} className="slider__btn slider__btn--left"><span className="fa fa-arrow-left"></span></button>
                    <button onClick={this.slideRight.bind(this, page)} className="slider__btn slider__btn--right"><span className="fa fa-arrow-right"></span></button>
                    <div className="dots">
                        <span className="active--dot fa fa-circle"></span>
                        <span className="inactive--dot fa fa-circle"></span>
                        <span className="inactive--dot fa fa-circle"></span>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

class ConfigurationSetup extends React.Component {
    render() {
        const {content, index, handler} = this.props;

        console.table(content);

        const staticSettings = content.slice().filter((a,b) => a.ParameterIndex === '-1' && a.OptionIndex === '0').filter((a, b) => a !== undefined);   

        
        let rows = [];
        let rowCount = 0;
        let moreRows = true

        // extract settings "rows" (needs a better term) to display
        while(moreRows) {
            let currentRow = content.map((el) => {
                if(el.OptionIndex == rowCount) {

                    return el;
                }
            }).filter((a,b) => a !== undefined);
            if (currentRow.length === 0) {
                moreRows = false;
            } else {
                rows.push(currentRow);
            }
            rowCount++;

        }
        console.dir(rows);

        let display = <p>no content</p>;
        display = display && content[0] &&  content[0].ConfigurationArea && (
            <React.Fragment>

                <div className="container-fluid">
                    <ConfigurationDisplayHeading handler={handler} heading={content[0].ConfigurationArea.toUpperCase()}/>
                    {staticSettings.map((col, index) => {

                        return (
                            <ConfigScreen col={col} index={index} />
                        )
                    })}
                    <hr />
                    <SubOptions page={content[0].ConfigurationArea}/>
                    {/* {rows.length > 0 ? rows.map((col, index) => <SubOptions />) : <p>No configs below this.</p>} */}
                </div>
                

            </React.Fragment>);
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

class ConfigRow extends React.Component {

    render() {
        const {content, index} = this.props;
        console.warn(content);
        return (
            <div key={createGUID()} className="pl-1 row mb-1 content ${content.id}">
                {content.length > 0 ? content.map((column, index) => {
                    return (
                        <div key={createGUID()} className={`col-${column.colSize}`}>
                            {/* {(!column.subContent ? 
                                React.createElement(column.element, {
                                    key: index + 10,
                                    className: column.className + ' dropdown-toggle',
                                    "data-toggle":"dropdown"
                                }, 
                                column.textContent ) : 
                                column.subContent.length > 0 ?
                                <div className={column.className}>
                                    {column.subContent.map((subCol, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`col-${subCol.colSize}`}
                                            >
                                                <div
                                                    onClick={this.props.handler} 
                                                    className={subCol.className}
                                                >
                                                    <i
                                                        className={subCol.subClassName}
                                                        aria-hidden="true"
                                                    >
                                                        {subCol.textContent}
                                                    </i>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {// TODO: need dropdown object defined 
                                    } */}
                                    <div className="dropdown">
                                        <span className={`${column.className} dropdown-toggle`} data-toggle="dropdown">test</span>
                                        <ul className="miniPopUp dropdown-menu">
                                            <div className="drop-container">
                                                {['test1', 'test2', 'test3', 'test4'].map((item, i) => {
                                                    return (
                                                        <li key={createGUID()} onClick={this.props.handler} className="btn btn-outline-primary controlLink text-center">{item}</li>
                                                    );
                                                })}
                                            </div>
                                        </ul>
                                    </div>
                                {/* : <p>no sub cols</p>)} */}
                        </div>
                    );
                }) : <p>no header rows</p>}
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
        // TODO: state variable needs to contain settings object to be manipulated when an option is changed.
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
        // return $(domElement).parent().append('<div className="miniPopUp">test</div>').on('click', function(e) {
        //     console.log(e);
        // });
        // renderPopUp(this.changeHandler, 'test', id)
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

        if ($(e.currentTarget)[0].className.includes('controlLink')) {
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
  