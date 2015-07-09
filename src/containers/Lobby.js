import React from "react";
import StyleSheet from'react-style';

const styles = StyleSheet.create({
    page: {
        height: '100%'
    }
});

export default class Lobby {
    render() {
        return <div styles={[styles.page]}>
            Lobby
        </div>;
    }
}
