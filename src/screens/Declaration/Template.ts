
export enum DeclarationElementType {
    Title = "title",
    Subtitle = "subtitle",
    Body = "body",

    TextInput = "textInput",
    TextInputMultiline = "textInputMultiline",
    InputDate = "inputDate",

    Checkbox = "checkbox",

    EmptySpace = "emptySpace"
}

  
export interface DeclarationElement {
    text?: string
    placeholder?: string
    type: DeclarationElementType
    name?: string
    id?: string
    value?: any
    disabled?: boolean
}
  
export const exampleTemplate: DeclarationElement[] = [
    { 
        text: "Attestation de déplacement dérogatoire",
        type: DeclarationElementType.Title
    },{ 
        text: "En application de l’article 1er du décret du 16 mars 2020 portant réglementation des déplacements dans le cadre de la lutte contre la propagation du virus Covid-19 :",
        type: DeclarationElementType.Subtitle
    },{ 
        type: DeclarationElementType.EmptySpace
    },{ 
        text: "Je soussigné(e)",
        type: DeclarationElementType.Body
    },{ 
        text: "Mme / M.",
        placeholder: "Prénom Nom…",
        type: DeclarationElementType.TextInput,
        id: "name",
    },{ 
        text: "Né(e) le :",
        type: DeclarationElementType.InputDate,
        id: "birthday",
    },{ 
        text: "Demeurant",
        placeholder: "Adresse…",
        type: DeclarationElementType.TextInputMultiline,
        id: "address",
    },{ 
        text: "certifie que mon déplacement est lié au motif suivant (cocher la case) autorisé par l’article 1er du décret du 16 mars 2020 portant réglementation des déplacements dans le cadre de la lutte contre la propagation du virus Covid-19 :",
        type: DeclarationElementType.Body
    },{ 
        text: "déplacements entre domicile et le lieu d’exercice de l’activité professionnelle, lorsqu’ils sont indispensables à l’exercice d’activités ne pouvant être organisées sous forme de télétravail (sur justificatif permanent) ou déplacements professionnels ne pouvant être différés;",
        type: DeclarationElementType.Checkbox,
        name: "motivation",
        id: "motivation_work",
    },{ 
        text: "déplacements pour effectuer des achats de première nécessité dans des établissements autorisés (liste sur gouvernement.fr);",
        type: DeclarationElementType.Checkbox,
        name: "motivation",
        id: "motivation_shop",
    },{ 
        text: "déplacements pour motif de santé;",
        type: DeclarationElementType.Checkbox,
        name: "motivation",
        id: "motivation_health",
    },{ 
        text: "déplacemenets pour motif familial impérieux, pour l’assistance aux personnes vulnérables ou la garde d’enfants;",
        type: DeclarationElementType.Checkbox,
        name: "motivation",
        id: "motivation_family",
    },{ 
        text: "déplacements brefs, à proximité du domicile, liés à l’activité physique individuelle des personnes, à l’exclusion de toute pratique sportive collective, et aux besoins des animaux de compagnie.",
        type: DeclarationElementType.Checkbox,
        name: "motivation",
        id: "motivation_sport",
    },{ 
        text: "Fait à",
        placeholder: "Lieu…",
        type: DeclarationElementType.TextInput,
        id: "lieu_signedoff",
    },{ 
        text: "Le :",
        type: DeclarationElementType.InputDate,
        id: "date_signedoff",
        disabled: true
    }
]
