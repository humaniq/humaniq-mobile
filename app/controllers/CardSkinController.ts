import { PictureSourceDescriptor } from "../references/images"
import { localStorage } from "utils/localStorage"
import { inject } from "react-ioc"
import { WalletController } from "./WalletController"
import { makeAutoObservable, reaction } from "mobx"

enum CardSkin {
  Default = "default",
  Dark = "dark",
  Cat = "the-cat",
  Ape = "the-ape",
  Peace = "the-peace"
}

type SkinPicture = {
  backgroundType: "image";
  picture: {
    src: any;
    sources?: Array<PictureSourceDescriptor>;
    webpSources?: Array<PictureSourceDescriptor>;
  };
};

type SkinPlainColor = {
  backgroundType: "color";
  backgroundColor: string;
};

export type Skin = (SkinPicture | SkinPlainColor) & {
  key: CardSkin;
  nameTranslationKey: string;
  textColor: string;
};

const registry: Record<CardSkin, Skin> = {
  [CardSkin.Default]: {
    key: CardSkin.Default,
    nameTranslationKey: "skin.default.name",
    backgroundType: "color",
    backgroundColor: "skinBackGroundWhite", //"#fff",
    textColor: "skinTextBlack", //"#333",
  },
  [CardSkin.Dark]: {
    key: CardSkin.Dark,
    nameTranslationKey: "skin.dark.name",
    backgroundType: "color",
    backgroundColor: "skinBackgroundBlack", // "#404040",
    textColor: "skinTextWhite", //"#fff",
  },
  [CardSkin.Cat]: {
    key: CardSkin.Cat,
    nameTranslationKey: "skin.cat.name",
    backgroundType: "image",
    picture: {
      src: require("assets/images/card_skin_cat.png"),
    },
    textColor: "skinTextWhite", //"#fff",
  },
  [CardSkin.Ape]: {
    key: CardSkin.Ape,
    nameTranslationKey: "skin.ape.name",
    backgroundType: "image",
    picture: {
      src: require("assets/images/card_skin_ape.png"),
    },
    textColor: "skinTextWhite", //"#fff",
  },
  [CardSkin.Peace]: {
    key: CardSkin.Peace,
    nameTranslationKey: "skin.peace.name",
    backgroundType: "image",
    picture: {
      src: require("assets/images/card_skin_peace.png"),
    },
    textColor: "skinTextBlack", // "#333",
  },
}

const available = [ CardSkin.Default, CardSkin.Dark, CardSkin.Cat, CardSkin.Ape, CardSkin.Peace ]

export class CardSkinController {

  initialized = false
  cardSkin: CardSkin
  selectedCardSkin

  wallet = inject(this, WalletController)

  constructor() {
    makeAutoObservable(this)
  }

  init = async (force = false) => {
    if (this.initialized && !force) return
    this.cardSkin = await localStorage.load<CardSkin>(`card-skin[${ this.wallet.web3.address ?? "" }]`, CardSkin.Default)
    if (!available.includes(this.cardSkin)) {
      this.cardSkin = CardSkin.Default
    }

    this.selectedCardSkin = await localStorage.load("card-skin-selected", false)
    this.initialized = true

    reaction(() => this.wallet.web3.address, () => {
      this.init(true)
    })
  }

  setSkin = async (s: CardSkin) => {
    this.cardSkin = s
    await localStorage.save(`card-skin[${ this.wallet.web3.address ?? "" }]`, s)
    this.selectedCardSkin = true
  }

  get skin() {
    return registry[this.cardSkin]
  }

  get availableSkins() {
    return Object.values(registry).filter((v) => available.includes(v.key))
  }
}
