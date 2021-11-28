import { UseDisclosureReturn } from '@chakra-ui/hooks'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { add, isAfter, isBefore } from 'date-fns'
import React, { useMemo, useRef } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'

import 'react-datepicker/dist/react-datepicker.css'

import { activeUserEventsSelector, createEvent } from '../../store/events.reducer'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { activeUserSelector } from '../../store/users.reducer'

import { checkDatesIntersection } from './utils'

type EventFormData = {
  name: string
  startDate: Date
  endDate: Date
}

export const CreateEventModal: React.FC<{ startHour: Date } & UseDisclosureReturn> = ({
  startHour,
  isOpen,
  onClose,
}) => {
  const activeUser = useAppSelector(activeUserSelector)
  const dispatch = useAppDispatch()
  const baseStartDate = useRef(startHour)
  const baseEndDate = useRef(add(baseStartDate.current, { hours: 1 }))

  const methods = useForm<EventFormData>({
    mode: 'onBlur',
    defaultValues: {
      startDate: baseStartDate.current,
      endDate: baseEndDate.current,
    },
  })

  const {
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors },
  } = methods

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const activeUserEvents = useAppSelector(activeUserEventsSelector)
  const activeUserEventsForDate = useMemo(
    () =>
      activeUserEvents.find(({ startDate: eventStartDate, endDate: eventEndDate }) =>
        checkDatesIntersection(eventStartDate, eventEndDate, startDate, endDate)
      ),
    [activeUserEvents, startDate, endDate]
  )

  return activeUser ? (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create an event</ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={handleSubmit((data) => {
            dispatch(
              createEvent({
                event: {
                  ...data,
                  startDate: data.startDate.getTime(),
                  endDate: data.endDate.getTime(),
                  userId: activeUser.id,
                },
              })
            )
            reset()
            onClose()
          })}
        >
          <ModalBody>
            <FormControl mr={10}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                id="name"
                placeholder="Event name"
                {...register('name', { required: true })}
              />

              {errors.name?.type === 'required' && (
                <FormErrorMessage>Name is required</FormErrorMessage>
              )}
            </FormControl>

            <ControlledDateRangePicker
              methods={methods}
              startDate={startDate}
              endDate={endDate}
            />
            {!!activeUserEventsForDate && (
              <Alert mt={5} status="error">
                <AlertIcon />
                There is already an event during this period.
              </Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!!activeUserEventsForDate}
              colorScheme="blue"
              mr={3}
              type="submit"
            >
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  ) : null
}

const ControlledDateRangePicker: React.FC<{
  methods: UseFormReturn<EventFormData, any>
  startDate: Date
  endDate: Date
}> = ({ methods, startDate, endDate }) => {
  const {
    control,
    formState: { errors },
  } = methods

  return (
    <>
      <FormControl isInvalid={!!errors.startDate} mr={10}>
        <FormLabel>Start date</FormLabel>
        <Controller
          control={control}
          name="startDate"
          rules={{
            required: true,
            validate: {
              startDateBeforeEndDate: (value) => isBefore(value, endDate),
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <DatePicker
              ref={ref}
              selected={value}
              selectsStart
              startDate={value}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={60}
              dateFormat="dd/MM/yyy HH:mm"
              customInput={<CustomDateRangeInput />}
              onChange={(date) => {
                onChange(date)
                onBlur()
              }}
              onBlur={onBlur}
              endDate={endDate}
            />
          )}
        />
        {errors.startDate?.type === 'required' && (
          <FormErrorMessage>Start date is required</FormErrorMessage>
        )}

        {errors.startDate?.type === 'startDateBeforeEndDate' && (
          <FormErrorMessage>Start date should be before end date</FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.endDate}>
        <FormLabel>End date</FormLabel>
        <Controller
          control={control}
          name="endDate"
          rules={{
            required: true,
            validate: {
              endDateAfterStartDate: (value) => isAfter(value, startDate),
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <DatePicker
              ref={ref}
              selected={value}
              onChange={(date) => {
                onChange(date)
                onBlur()
              }}
              onBlur={onBlur}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={60}
              dateFormat="dd/MM/yyy HH:mm"
              customInput={<CustomDateRangeInput />}
            />
          )}
        />
        {errors.endDate?.type === 'required' && (
          <FormErrorMessage>End date is required</FormErrorMessage>
        )}

        {errors.endDate?.type === 'endDateAfterStartDate' && (
          <FormErrorMessage>End date should be after start date</FormErrorMessage>
        )}
      </FormControl>
    </>
  )
}

const CustomDateRangeInput = React.forwardRef<
  HTMLButtonElement,
  {
    value?: string
    onClick?: () => void
  }
>(({ value, onClick }, ref) => <Input readOnly value={value} onClick={onClick} />)
