import { databases } from '../lib/appwrite'
import { ID, Query, Models } from 'appwrite'

const dbId = '680320050000d4776182'
const iterinaryCollectionId = 'itirenaryCollection'
const messageCollectionId = '67af17bd002ffe97bdd5'

interface UserData {
  $id: string
}

interface MessageData {
  [key: string]: any
}

export async function saveTripData (
  tripData: any,
  userData: string | null,
  iterinary: string
): Promise<string> {
  try {
    const formattedViaCities =
      tripData.viaCities && tripData.viaCities.length > 0
        ? tripData.viaCities.map((item : any) => item.city).join(', ')
        : 'Nil'

    const response = await databases.createDocument(
      dbId,
      iterinaryCollectionId,
      ID.unique(),
      {
        userId: userData,
        departureState: tripData.departureState,
        departureCity: tripData.departureCity,
        destinationState: tripData.destinationState,
        destinationCity: tripData.destinationCity,
        startDate: new Date(String(tripData.startDate)).toISOString(),
        endDate: new Date(String(tripData.endDate)).toISOString(),
        numberOfPeople: tripData.numberOfPeople,
        groupType: tripData.groupType,
        interests: tripData.interests,
        additionalInfo: tripData.additionalInfo,
        language: tripData.language,
        viaCities: formattedViaCities,
        iterinary: iterinary
      }
    )

    return response.$id
  } catch (error) {
    console.error('Error saving trip data:', error)
    throw error
  }
}

export async function saveMessage (
  newMessage: MessageData
): Promise<Models.Document> {
  try {
    console.log(newMessage)
    const response = await databases.createDocument(
      dbId,
      messageCollectionId,
      ID.unique(),
      newMessage
    )
    console.log(response)
    return response
  } catch (error) {
    console.error('Error saving message:', error)
    throw error
  }
}

export async function fetchUserTrips (
  userId: string
): Promise<Models.Document[]> {
  try {
    const response = await databases.listDocuments(
      dbId,
      iterinaryCollectionId,
      [Query.equal('userId', userId)]
    )
    return response.documents
  } catch (error) {
    console.error('Error fetching trips:', error)
    throw error
  }
}

export async function getMessagesForItinerary (
  iterinaryId: string
): Promise<Models.Document[]> {
  try {
    const response = await databases.listDocuments(dbId, messageCollectionId, [
      Query.equal('iterinaryId', iterinaryId)
    ])
    return response.documents
  } catch (error) {
    console.error('Error fetching messages for itinerary:', error)
    throw error
  }
}

export async function deleteIterinary (iterinaryId: string): Promise<boolean> {
  try {
    const response = await databases.listDocuments(dbId, messageCollectionId, [
      Query.equal('iterinaryId', iterinaryId)
    ])
    const messages = response.documents

    for (const message of messages) {
      await databases.deleteDocument(dbId, messageCollectionId, message.$id)
    }

    await databases.deleteDocument(dbId, iterinaryCollectionId, iterinaryId)
    console.log('Deleted trip:', iterinaryId)
    return true
  } catch (error) {
    console.error('Error deleting messages:', error)
    throw error
  }
}

export async function updateIterinary (
  iterinaryId: string,
  updateData: string
): Promise<Models.Document> {
  try {
    const response = await databases.updateDocument(
      dbId,
      iterinaryCollectionId,
      iterinaryId,
      { iterinary: updateData }
    )
    console.log('Updated iterinary:', response)
    return response
  } catch (error) {
    console.error('Error updating iterinary:', error)
    throw error
  }
}

export const loadItineraryById = async (itineraryId: string) => {
  try {
    const response = await databases.getDocument(
      dbId,
      iterinaryCollectionId,
      itineraryId
    )

    return {
      success: true,
      data: response
    }
  } catch (error: any) {
    console.error('Error loading itinerary:', error)
    return {
      success: false,
      error: error.message || 'Failed to load itinerary'
    }
  }
}
