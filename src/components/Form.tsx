import React, { FormEvent } from 'react'
import Select from 'react-select'
import Loader from './Loader'

interface Option {
  label: string
  value: string
}
interface ViaCity {
  state: Option | null
  city: Option | null
}

interface PlanFormProps {
  stateOptions: Option[]
  fetchCitiesByState: (stateName: string) => Promise<Option[]>
  onSubmit: (e: FormEvent) => void
  departureState: Option | null
  setDepartureState: (val: Option | null) => void
  departureCity: Option | null
  setDepartureCity: (val: Option | null) => void
  departureCityOptions: Option[]
  viaCities: ViaCity[]
  viaCityOptions: Option[][]
  handleViaChange: (
    idx: number,
    key: 'state' | 'city',
    val: Option | null
  ) => void
  handleAddVia: () => void
  handleRemoveVia: (idx: number) => void
  destinationState: Option | null
  setDestinationState: (val: Option | null) => void
  destinationCity: Option | null
  setDestinationCity: (val: Option | null) => void
  destinationCityOptions: Option[]
  startDate: string
  setStartDate: (val: string) => void
  endDate: string
  setEndDate: (val: string) => void
  numberOfPeople: number
  setNumberOfPeople: (val: number) => void
  groupType: string
  setGroupType: (val: string) => void
  getGroupTypeOptions: () => Option[]
  interests: string
  setInterests: (val: string) => void
  language: string
  setLanguage: (val: string) => void
  additionalInfo: string
  setAdditionalInfo: (val: string) => void
  isLoading: boolean
}

const PlanForm: React.FC<PlanFormProps> = ({
  stateOptions,
  departureState,
  setDepartureState,
  departureCity,
  setDepartureCity,
  departureCityOptions,
  viaCities,
  viaCityOptions,
  handleViaChange,
  handleAddVia,
  handleRemoveVia,
  destinationState,
  setDestinationState,
  destinationCity,
  setDestinationCity,
  destinationCityOptions,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  numberOfPeople,
  setNumberOfPeople,
  groupType,
  setGroupType,
  getGroupTypeOptions,
  interests,
  setInterests,
  language,
  setLanguage,
  additionalInfo,
  setAdditionalInfo,
  onSubmit,
  isLoading
}) => {
  const groupTypeOptions = getGroupTypeOptions().filter(opt => {
    if (numberOfPeople === 1) return opt.value === 'Solo'
    if (numberOfPeople === 2) return opt.value !== 'Solo'
    return opt.value !== 'Solo' && opt.value !== 'Couple'
  })

  return (
    <form
      onSubmit={onSubmit}
      className='bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-3xl space-y-6'
    >
      <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>
        Plan Your Journey
      </h1>

      {/* Departure */}
      <div>
        <label className='block font-semibold text-gray-700 mb-2'>
          Departure
        </label>
        <div className='grid md:grid-cols-2 gap-4'>
          <Select
            placeholder='State'
            options={stateOptions}
            value={departureState}
            onChange={setDepartureState}
            isClearable
          />
          <Select
            placeholder='City'
            options={departureCityOptions}
            value={departureCity}
            onChange={setDepartureCity}
            isDisabled={!departureState}
            isClearable
          />
        </div>
      </div>

      {/* Via Cities */}
      {viaCities.map((via, idx) => (
        <div key={idx}>
          <label className='block font-semibold text-gray-700 mb-2'>
            Via {idx + 1}
          </label>
          <div className='grid md:grid-cols-3 gap-4'>
            <Select
              placeholder='State'
              options={stateOptions}
              value={via.state}
              onChange={opt => handleViaChange(idx, 'state', opt)}
              isClearable
            />
            <Select
              placeholder='City'
              options={viaCityOptions[idx]}
              value={via.city}
              onChange={opt => handleViaChange(idx, 'city', opt)}
              isDisabled={!via.state}
              isClearable
            />
            <button
              type='button'
              onClick={() => handleRemoveVia(idx)}
              className='text-red-600'
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button type='button' onClick={handleAddVia} className='text-blue-700'>
        + Add Via
      </button>

      {/* Destination */}
      <div>
        <label className='block font-semibold text-gray-700 mb-2'>
          Destination
        </label>
        <div className='grid md:grid-cols-2 gap-4'>
          <Select
            placeholder='State'
            options={stateOptions}
            value={destinationState}
            onChange={setDestinationState}
            isClearable
          />
          <Select
            placeholder='City'
            options={destinationCityOptions}
            value={destinationCity}
            onChange={setDestinationCity}
            isDisabled={!destinationState}
            isClearable
          />
        </div>
      </div>

      {/* Travel Info */}
      <div>
        <label className='block font-semibold text-gray-700 mb-2'>
          Travel Info
        </label>
        <div className='grid md:grid-cols-4 gap-4'>
          <div>
            <label className='block text-sm mb-1'>Start</label>
            <input
              type='date'
              value={startDate}
              onChange={e => {
                const val = e.target.value
                setStartDate(val)
                if (val > endDate) setEndDate(val)
              }}
              className='border p-2 rounded w-full'
              required
            />
          </div>
          <div>
            <label className='block text-sm mb-1'>End</label>
            <input
              type='date'
              value={endDate}
              onChange={e => {
                const val = e.target.value
                setEndDate(val)
                if (val < startDate) setStartDate(val)
              }}
              className='border p-2 rounded w-full'
              required
            />
          </div>
          <div>
            <label className='block text-sm mb-1'>Travelers</label>
            <input
              type='number'
              min={1}
              value={numberOfPeople}
              onChange={e => {
                const value = Math.max(1, parseInt(e.target.value))
                setNumberOfPeople(value)

                const availableOptions = getGroupTypeOptions().filter(opt => {
                  if (value === 1) return opt.value === 'Solo'
                  if (value === 2) return opt.value !== 'Solo'
                  return opt.value !== 'Solo' && opt.value !== 'Couple'
                })

                if (!availableOptions.find(opt => opt.value === groupType)) {
                  setGroupType(availableOptions[0].value)
                }
              }}
              className='border p-2 rounded w-full'
            />
          </div>
          <div>
            <label className='block text-sm mb-1'>Group Type</label>
            <Select
              options={groupTypeOptions}
              value={groupTypeOptions.find(o => o.value === groupType)}
              onChange={opt =>
                setGroupType(opt?.value || groupTypeOptions[0].value)
              }
              isSearchable={false}
            />
          </div>
        </div>
      </div>

      {/* Extras */}
      <div>
        <label className='block font-semibold text-gray-700 mb-2'>
          Interests
        </label>
        <input
          type='text'
          value={interests}
          onChange={e => setInterests(e.target.value)}
          placeholder='e.g. food, culture'
          className='border p-2 rounded w-full mb-4'
          required
        />
        <label className='block font-semibold text-gray-700 mb-2'>
          Language
        </label>
        <Select
          options={[
            { label: 'English', value: 'English' },
            { label: 'Hindi', value: 'Hindi' }
          ]}
          value={{ label: language, value: language }}
          onChange={opt => setLanguage(opt?.value || 'English')}
          isSearchable={false}
        />
      </div>

      {/* Additional Info */}
      <div>
        <label className='block font-semibold text-gray-700 mb-2'>
          Additional Info
        </label>
        <textarea
          rows={3}
          value={additionalInfo}
          onChange={e => setAdditionalInfo(e.target.value)}
          placeholder='Any special requests?'
          className='w-full border p-2 rounded'
        ></textarea>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <button
          type='submit'
          className='w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200'
        >
          Submit
        </button>
      )}
    </form>
  )
}

export default PlanForm
