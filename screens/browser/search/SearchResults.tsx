import { HistoryItem } from "../../../store/browser/BrowserStore";
import { Colors, Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import React from "react";

interface SearchResultsProps {
    results: [string, HistoryItem][]
    onSearchSubmit?: (val: any) => void
    isSearchMode?: boolean
}

export const SearchResults = ({ results, onSearchSubmit, isSearchMode }: SearchResultsProps) => {
    return <View backgroundColor={ Colors.bg } flex-10 flexG-10
                 style={ !isSearchMode ? { display: 'none' } : {} }>
        { results.map((h, i) => {
            return <TouchableOpacity testID={ `searchResults-${ i }` } row key={ h[1].url } paddingH-16
                                     paddingV-5
                                     activeOpacity={0.6}
                                     onPress={ () => onSearchSubmit(h[1].url) }>
                <View centerV>
                    <Image source={ { uri: h[1].icon } } style={ { width: 32, height: 32 } }/>
                </View>
                <View flex-1 paddingL-14>
                    <Text text16 numberOfLines={ 1 }>{ h[1].tittle }</Text>
                    <Text primary numberOfLines={ 1 }>{ h[1].url }</Text>
                </View>
            </TouchableOpacity>
        }) }
    </View>
}
