import * as React from 'react'
import { Button, Text, View } from 'react-native'
import BottomSheet from 'reanimated-bottom-sheet'

export function Test() {
    const renderContent = () => (
            <View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        flexGrow: 1,
                        backgroundColor: 'white',
                        padding: 16,
                        // height: 300,
                    }}
            >
                <Text>Swipe down to close</Text>
            </View>
    );

    const sheetRef = React.useRef(null);

    return (
            <>
                <View
                        style={{
                            flex: 1,
                            backgroundColor: 'papayawhip',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                >
                    <Button
                            title="Open Bottom Sheet"
                            onPress={() => sheetRef.current.snapTo(0)}
                    />
                    <Button
                            title="Open Bottom Sheet"
                            onPress={() => sheetRef.current.snapTo(1)}
                    />
                </View>
                <BottomSheet
                        ref={sheetRef}
                        initialSnap={1}
                        snapPoints={[300, 0]}
                        borderRadius={10}
                        renderContent={renderContent}
                />
            </>
    );
}
