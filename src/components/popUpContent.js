import React from 'React';
class PopUpContainer extends React.Component {

    constructor(props) {
        super(props);
        const state = {
            handler : props.handler,
            content : props.content
        }
    }

    render() {
        return (
            <div className="miniPopUp" onClick={this.state.handler}>
                {this.state.content}
            </div>
        )
    }
}

function renderPopUp(handler, content, root) {
    ReactDOM.render(
        <PopUpContainer 
            handler={handler} 
            content={content}
        />,
        document.getElementById(root)
    );
}