export enum Source {
    Facebook = 'facebook',
    GBM = 'gbm',
    Liveperson = 'liveperson',
    RCS = 'rcs',
    Teams = 'teams',
    Whatsapp = 'whatsapp',
    Widget = 'widget',
    Workplace = 'workplace',
    Zenvia = 'zenvia',
}

export enum Channel {
    Apple = 'apple',
    Debugger = 'debugger',
    Facebook = 'facebook',
    GBM = 'gbm',
    RCS = 'rcs',
    Teams = 'teams',
    Whatsapp = 'whatsapp',
    Widget = 'widget',
    Workplace = 'workplace',
}

export interface Context {}

export interface Fields {}

export interface Extra {}


export interface InputFile {
    source: string,
    name: string,
    url: string,
    type: string,
    contentType: string,
    size?: number,
    caption?: string
}

/**
 * Input de dados do usuário, esperado pelo altubots
 */
export interface Input {
    text?: string,
    file?: InputFile,
    location?: {
        latitude: string | number,
        longitude: string | number,
        name?: string,
        address?: string,
        url?: string
    },
    order?: {
        catalogId: string,
        productItems: any[]
    }
    unsupportedMessage?: {
        response: string[]
    },
}

/**
 * Mensagem aceita pelo altubots
 */
 interface Message {
    slug: string,
    assistantId: number,
    identifier: string,
    init?: {
        context?: Context
        fields?: Fields,
        extra?: Extra
    },
    source: Source,
    source_id: string | number,
}

/**
 * Mensagem aceita pelo altubots
 */
export interface SupportedMessage extends Message {
    homol?: boolean,
    inactivity?: string | number,
    external_id?: string,
    input: Input
}

/**
 * Mensagem não suportada aceita pelo altubots
 */
export interface UnsupportedMessage extends Message {
    response?: string | string[]
}

/**
 * Output de dados do altubots, esperado pelos SourceClients
 */
export interface Output {
    type: string,
    payload?: {},
}

/**
 * Mensagem enviada por altubots
 */
export interface OutgoingMessage {
    slug: string,
    source: Source,
    sourceId: string | number,
    channel: Channel,
    externalId?: string,
    identifier?: string,
    extra?: Record<string, any>,
    messages: Output[]
}

/**
 * Componente de output Quick Reply
 */
export interface QuickReply extends Output {
    readonly type: 'quick_replies',
    payload: {
        pick: string,
        replies: {
            title?: string,
            value?: any
        }[]
    }
}

/**
 * Componente de output *Select*
 */
export interface Select extends Output {
    readonly type: 'select',
    payload: {
        pick: string,
        options: {
            title?: string,
            value?: any
        }[]
    }
}

/**
 * Componente de output *Option List*
 */
export interface OptionList extends Output {
    type: 'option_list',
    payload: {
        pick: string,
        options: {
            title?: string,
            value?: any
        }[]
    }
}

/**
 * Componente de output *Carousel*
 */
export interface Carousel extends Output {
    type: 'carousel',
    payload: {
        pick: string,
        options: {
            image?: string,
            title?: string,
            value?: string | number,
            label?: string,
            description?: string,
            btnLabel?: string,
        }[]
    }
}

/**
 * Tipo List representa qualquer componente de output do tipo lista do altu.
 */
export type List = (QuickReply | Select | OptionList | Carousel);
