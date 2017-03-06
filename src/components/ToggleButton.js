var ToggleButton = React.createClass({
    displayName: 'ToggleButton',

    propTypes: {
        label: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired,
        handleClick: React.PropTypes.func.isRequired
    },
    render: function render() {
        return React.createElement(
            'button',
            {
                className: 'toggleButton',
                id: this.props.id,
                onClick: this.props.handleClick },
            this.props.label
        );
    }
});
