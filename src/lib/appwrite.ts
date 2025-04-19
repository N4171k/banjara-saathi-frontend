// lib/appwrite.ts
import { Client, Account, Databases } from 'appwrite'

const client = new Client()

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // Use your self-hosted URL or cloud endpoint
  .setProject('banjarasaathi') // Replace with your Appwrite Project ID

const account = new Account(client)
const databases = new Databases(client)

export { client, account, databases }
