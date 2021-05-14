/**
 * renders TabMenu - this is the tab menu bar across top of setup (configuration) page
 * //TODO: on click events implemented here
 */
 class TabListItem extends React.Component {
    constructor(props) {
        super(props);
        

    }

    componentDidMount() {
        this.setState({
            "is-active":this.props.activeTab
        })
    }

    render() {
        const {tab, index, changeTab, activeTab} = this.props;
        return (
            <li 
                key={tab.ConfigurationArea + tab.Icon} 
                className={(index == activeTab ? 'tab-select is-active' : 'tab-select')} 
                onClick={changeTab}
                data-tab={index}
                role="presentation">
                <a href={`#${tab.ConfigurationArea}`} >
                    <i className={`${tab.Icon}`}></i> 
                    {tab.ConfigurationArea}
                </a>
            </li>
            );
    }
}