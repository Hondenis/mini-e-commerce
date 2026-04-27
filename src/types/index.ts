export type Role = 'admin' | 'customer'

export interface ApiUserName {
    firstname: string
    lastname: string
}

export interface ApiUserAddressGeo {
    lat: string
    long: string
}

export interface ApiUserAdress {
    geolocation: ApiUserAddressGeo
    city: string
    street: string
    number: number
    zipcode: string
}

export interface ApiUser {
    id: number
    email: string
    username: string
    password: string
    name: ApiUserName
    address: ApiUserAdress
    phone: string
}

export interface User extends ApiUser {
    role: Role
}

export interface Product {
    id: number | string
    title: string
    price: number
    description: string
    category: string
    image: string
    rating?: {
        rate: number
        count: number
    }
}

export interface CartLine {
    productId: Product['id']
    quantity: number
}

export interface AuthSession {
    token: string
    user: User
}

export interface ApiErrorShape {
    status: number
    message: string
    cause?: unknown
}