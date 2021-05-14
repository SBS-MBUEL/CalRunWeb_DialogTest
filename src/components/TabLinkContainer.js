

class TabLinkContainer extends React.Component{
    render() {
        const { tabs, changeActiveTab, activeTab } = this.props;

        return (
            <div className="columns">
                <div className="column">
                    <ul className="panel-tabs" role="tablist">
                        {
                            tabs.length > 0 ? 
                                tabs.map((tab, i) => {
                                    return <TabListItem key={i} changeTab={changeActiveTab} activeTab={activeTab} index={i} tab={tab} />
                                }) : 
                                    <p>no tabs to select</p>
                        }
                    </ul>
                </div>   
            </div>
        )
    }
}