import * as React from "react";
const defaultState = Object.freeze({
    data: [],
    error: undefined,
    loading: true,
});
import { registryData } from "./localRegistry"
export default function useMobileRegistry() {
    const [state, setState] = React.useState(defaultState);
    React.useEffect(() => {
        (async () => {
            try {
                setState({
                    data: Object.values(registryData),
                    error: undefined,
                    loading: false,
                });
            }
            catch (error) {
                console.error(error);
                setState({ ...defaultState, error: error, loading: false });
            }
        })();
    }, [setState]);
    return state;
}
