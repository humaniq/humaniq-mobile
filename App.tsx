// import * as React from "react";
// import {
//   withWalletConnect,
//   useWalletConnect, RenderQrcodeModalProps, WalletService,
// } from "@walletconnect/react-native-dapp"
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { IAsyncStorage } from "keyvaluestorage/dist/cjs/react-native/types"
// import { TouchableOpacity, View, Text } from "react-native"
// import BottomSheet from "@gorhom/bottom-sheet"
//
// function CustomBottomSheet({
//                              walletServices,
//                              visible,
//                              connectToWalletService,
//                              uri,
//                            }: RenderQrcodeModalProps): JSX.Element {
//   const renderContent = React.useCallback(() => {
//     return walletServices.map((walletService: WalletService, i: number) => (
//       <TouchableOpacity key={`i${i}`} onPress={() => connectToWalletService(walletService, uri)}>
//         {/*<Image source={{ uri: walletService.logo }} />*/}
//         <Text>{walletService.name}</Text>
//       </TouchableOpacity>
//     ));
//   }, [walletServices, uri]);
//   return <BottomSheet snapPoints={["10%, 100#"]}>{renderContent}</BottomSheet>;
// };
//
// function App(): JSX.Element {
//   const connector = useWalletConnect(); // valid
//   return <><View></View></>;
// }
//
// export default withWalletConnect(App, {
//   redirectUrl: "yourappscheme://",
//   storageOptions: {
//     asyncStorage: AsyncStorage as unknown as IAsyncStorage,
//   },
//   renderQrcodeModal: (props: RenderQrcodeModalProps): JSX.Element => (
//     <CustomBottomSheet {...props} />
//   ),
// });
