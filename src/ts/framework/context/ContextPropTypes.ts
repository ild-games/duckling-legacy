/**
 * Allows React to perform runtime type checking of a context. This is super
 * unecessary because ContextProviderComponent and DucklingComponent provide
 * compile time type checking that is far more effective. Unfortunately React
 * was designed for JavaScript and therefor won't shut the **** up about it.
 * @type {Object}
 */
const ContextPropTypes = {
    _views : React.PropTypes.object,
    _commandQueue : React.PropTypes.object,
    _window : React.PropTypes.object,
    _rivets : React.PropTypes.object,
    _sharedObjects : React.PropTypes.object,
    _systemWindow : React.PropTypes.object,
    systemLoader : React.PropTypes.object,
    onEnterContext : React.PropTypes.func,
    getSharedObject : React.PropTypes.func,
    getSharedObjectByKey : React.PropTypes.func,
    setSharedObject : React.PropTypes.func,
    setSharedObjectByKey : React.PropTypes.func,
    views : React.PropTypes.object,
    commandQueue : React.PropTypes.object,
    window : React.PropTypes.object,
    rivets : React.PropTypes.object,
    systemWindow : React.PropTypes.object
}

export {ContextPropTypes as default}
