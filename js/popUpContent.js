"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopUpContainer = function (_React$Component) {
    _inherits(PopUpContainer, _React$Component);

    function PopUpContainer(props) {
        _classCallCheck(this, PopUpContainer);

        var _this = _possibleConstructorReturn(this, (PopUpContainer.__proto__ || Object.getPrototypeOf(PopUpContainer)).call(this, props));

        var state = {
            handler: props.handler,
            content: props.content
        };
        return _this;
    }

    _createClass(PopUpContainer, [{
        key: "render",
        value: function render() {
            console.log(this.state.handler);
            return React.createElement(
                "div",
                { "class": "miniPopUp", onClick: this.state.handler },
                this.state.content
            );
        }
    }]);

    return PopUpContainer;
}(React.Component);

function renderPopUp(handler, content, root) {
    console.log(handler, content, root);
    ReactDOM.render(React.createElement(PopUpContainer, {
        handler: handler,
        content: content
    }), document.getElementById(root));
}