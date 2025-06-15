function getConfig(name, defaultValue=null) {
    if( window.ENV !== undefined ) {
        return window.ENV[name] || defaultValue;
    }

    return process.env[name] || defaultValue;
}

export function getBackendUrl() {
    return getConfig('REACT_APP_API_URL');
}
