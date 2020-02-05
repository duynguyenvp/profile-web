export const getDisplayName = function (WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}