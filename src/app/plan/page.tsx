'use client'

import React, { useEffect, useState, FormEvent } from 'react'
import PlanForm from '@/components/Form'
import axios from 'axios'
import { backendUrl } from '@/env.exports'
import { saveTripData } from '@/utils/dbHelpers'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

interface Option {
  label: string
  value: string
}

interface ViaCity {
  state: Option | null
  city: Option | null
}

export default function PlanPage () {
  const router = useRouter()
  const userId = useSelector((state: RootState) => state.user.userId)
  // States
  const [stateOptions, setStateOptions] = useState<Option[]>([])

  // Departure
  const [departureState, setDepartureState] = useState<Option | null>(null)
  const [departureCity, setDepartureCity] = useState<Option | null>(null)
  const [departureCityOptions, setDepartureCityOptions] = useState<Option[]>([])

  // Via Cities
  const [viaCities, setViaCities] = useState<ViaCity[]>([])
  const [viaCityOptions, setViaCityOptions] = useState<Option[][]>([])

  // Destination
  const [destinationState, setDestinationState] = useState<Option | null>(null)
  const [destinationCity, setDestinationCity] = useState<Option | null>(null)
  const [destinationCityOptions, setDestinationCityOptions] = useState<
    Option[]
  >([])

  // Travel Info
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1)
  const [groupType, setGroupType] = useState<string>('Solo')
  const [isLoading, setIsLoading] = useState(false)

  // Extras
  const [interests, setInterests] = useState<string>('')
  const [language, setLanguage] = useState<string>('English')
  const [additionalInfo, setAdditionalInfo] = useState<string>('')

  // Fetch cities when state changes for departure
  useEffect(() => {
    if (departureState) {
      fetchCitiesByState(departureState.value).then(cities => {
        setDepartureCityOptions(cities)
      })
    } else {
      setDepartureCityOptions([])
      setDepartureCity(null)
    }
  }, [departureState])

  // Fetch cities when state changes for destination
  useEffect(() => {
    if (destinationState) {
      fetchCitiesByState(destinationState.value).then(cities => {
        setDestinationCityOptions(cities)
      })
    } else {
      setDestinationCityOptions([])
      setDestinationCity(null)
    }
  }, [destinationState])

  // Update via city options when via state changes
  useEffect(() => {
    const updateViaCityOptions = async () => {
      const newOptions = await Promise.all(
        viaCities.map(via =>
          via.state ? fetchCitiesByState(via.state.value) : Promise.resolve([])
        )
      )
      setViaCityOptions(newOptions)
    }

    updateViaCityOptions()
  }, [viaCities])

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch(
          'https://countriesnow.space/api/v0.1/countries/states',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: 'India' })
          }
        )

        const json = await res.json()
        if (!json || !Array.isArray(json.data?.states))
          throw new Error('Invalid states data')

        const opts = json.data.states.map((s: any) => ({
          label: s.name,
          value: s.name
        }))
        setStateOptions(opts)
      } catch (err) {
        console.error('Failed to load states:', err)
        setStateOptions([])
      }
    }

    fetchStates()
  }, [])

  const fetchCitiesByState = async (stateName: string): Promise<Option[]> => {
    try {
      const res = await fetch(
        'https://countriesnow.space/api/v0.1/countries/state/cities',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: 'India', state: stateName })
        }
      )

      const json = await res.json()
      if (!json || !Array.isArray(json.data))
        throw new Error('Invalid city data')
      return json.data.map((c: string) => ({ label: c, value: c }))
    } catch (error) {
      console.error(`Failed to load cities for ${stateName}:`, error)
      return []
    }
  }

  // Via cities handlers
  const handleViaChange = (
    idx: number,
    key: 'state' | 'city',
    val: Option | null
  ) => {
    const newViaCities = [...viaCities]
    newViaCities[idx] = {
      ...newViaCities[idx],
      [key]: val,
      // Reset city if state changes
      ...(key === 'state' ? { city: null } : {})
    }
    setViaCities(newViaCities)
  }

  const handleAddVia = () => {
    setViaCities([...viaCities, { state: null, city: null }])
    setViaCityOptions([...viaCityOptions, []])
  }

  const handleRemoveVia = (idx: number) => {
    const newViaCities = [...viaCities]
    newViaCities.splice(idx, 1)
    setViaCities(newViaCities)

    const newViaCityOptions = [...viaCityOptions]
    newViaCityOptions.splice(idx, 1)
    setViaCityOptions(newViaCityOptions)
  }

  const getGroupTypeOptions = (): Option[] => {
    return [
      { label: 'Solo', value: 'Solo' },
      { label: 'Couple', value: 'Couple' },
      { label: 'Family', value: 'Family' },
      { label: 'Friends', value: 'Friends' },
      { label: 'Business', value: 'Business' }
    ]
  }

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = {
      departureState: departureState?.value,
      departureCity: departureCity?.value,
      destinationState: destinationState?.value,
      destinationCity: destinationCity?.value,
      startDate: startDate,
      endDate: endDate,
      numberOfPeople: numberOfPeople,
      groupType: groupType,
      interests: interests,
      language: language,
      additionalInfo: additionalInfo,
      viaCities: viaCities.map(via => via.city?.value)
    }

    try {
      // Send data to backend using axios
      const response = await axios.post(backendUrl + '/api/generate', formData)

      console.log('Success:', response.data)
      // Handle successful response
      if (response.data.success) {
        const savedId = await saveTripData(formData, userId, response.data.data)
        console.log('Trip data saved with ID:', savedId)
        setDepartureState(null)
        setDepartureCity(null)
        setDepartureCityOptions([])

        setViaCities([])
        setViaCityOptions([])

        setDestinationState(null)
        setDestinationCity(null)
        setDestinationCityOptions([])

        setStartDate('')
        setEndDate('')
        setNumberOfPeople(1)
        setGroupType('Solo')

        setInterests('')
        setLanguage('English')
        setAdditionalInfo('')
        router.push('/plan/' + savedId)
      } else {
        // Handle API error response
        console.error('API Error:', response.data.message)
      }
    } catch (error) {
      console.error('Request Error:', error)
      // Handle network or other errors
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-400 via-rose-100 to-blue-200 flex items-center justify-center p-6'>
      <PlanForm
        stateOptions={stateOptions}
        fetchCitiesByState={fetchCitiesByState}
        onSubmit={handleFormSubmit}
        departureState={departureState}
        setDepartureState={setDepartureState}
        departureCity={departureCity}
        setDepartureCity={setDepartureCity}
        departureCityOptions={departureCityOptions}
        viaCities={viaCities}
        viaCityOptions={viaCityOptions}
        handleViaChange={handleViaChange}
        handleAddVia={handleAddVia}
        handleRemoveVia={handleRemoveVia}
        destinationState={destinationState}
        setDestinationState={setDestinationState}
        destinationCity={destinationCity}
        setDestinationCity={setDestinationCity}
        destinationCityOptions={destinationCityOptions}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        numberOfPeople={numberOfPeople}
        setNumberOfPeople={setNumberOfPeople}
        groupType={groupType}
        setGroupType={setGroupType}
        getGroupTypeOptions={getGroupTypeOptions}
        interests={interests}
        setInterests={setInterests}
        language={language}
        setLanguage={setLanguage}
        additionalInfo={additionalInfo}
        setAdditionalInfo={setAdditionalInfo}
        isLoading={isLoading}
      />
    </div>
  )
}
