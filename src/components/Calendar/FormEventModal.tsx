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
  Box,
  Flex,
} from '@chakra-ui/react'
import { add, isAfter, isBefore } from 'date-fns'
import React, { useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'

import 'react-datepicker/dist/react-datepicker.css'

import {
  activeUserEventsSelector,
  createEvent,
  deleteEvent,
  editEvent,
  Event,
} from '../../store/events.reducer'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { activeUserSelector } from '../../store/users.reducer'

import { checkDatesIntersection } from './utils'

type EventFormData = {
  name: string
  startDate: Date
  endDate: Date
}

export const FormEventModal: React.FC<
  { startHour: Date; event?: Event } & UseDisclosureReturn
> = ({ event, startHour, isOpen, onClose }) => {
  const activeUser = useAppSelector(activeUserSelector)
  const dispatch = useAppDispatch()

  const defaultValues = useMemo(
    () =>
      event
        ? {
            name: event.name,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
          }
        : {
            startDate: startHour,
            endDate: add(startHour, { hours: 1 }),
          },
    [event, startHour]
  )

  const methods = useForm<EventFormData>({
    mode: 'onBlur',
    defaultValues,
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
      activeUserEvents.find(
        ({ id, startDate: eventStartDate, endDate: eventEndDate }) =>
          id !== event?.id &&
          checkDatesIntersection(eventStartDate, eventEndDate, startDate, endDate)
      ),
    [activeUserEvents, startDate, endDate, event]
  )

  return activeUser ? (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create an event</ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={handleSubmit((data) => {
            onClose()
            dispatch(
              event
                ? editEvent({
                    event: {
                      ...event,
                      name: data.name,
                      startDate: data.startDate.getTime(),
                      endDate: data.endDate.getTime(),
                    },
                  })
                : createEvent({
                    event: {
                      ...data,
                      startDate: data.startDate.getTime(),
                      endDate: data.endDate.getTime(),
                      userId: activeUser.id,
                    },
                  })
            )
            reset()
          })}
        >
          <ModalBody>
            <FormControl isInvalid={!!errors.name} mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
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

          <ModalFooter d="flex" justifyContent="space-between">
            <Box>{!!event && <DeleteButton event={event} onClose={onClose} />}</Box>

            <Box>
              <Button mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                isDisabled={!!activeUserEventsForDate}
                colorScheme="blue"
                type="submit"
              >
                Save
              </Button>
            </Box>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  ) : null
}

const DeleteButton: React.FC<{ event: Event; onClose: () => void }> = ({
  event,
  onClose,
}) => {
  const dispatch = useAppDispatch()
  const [state, setState] = useState(false)

  return state ? (
    <Flex>
      <Button onClick={() => setState(false)}>No</Button>
      <Button
        colorScheme="red"
        ml={3}
        onClick={() => {
          dispatch(deleteEvent({ id: event.id }))
          onClose()
        }}
      >
        Yes
      </Button>
    </Flex>
  ) : (
    <Button colorScheme="red" onClick={() => setState(true)}>
      Delete
    </Button>
  )
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
      <FormControl isInvalid={!!errors.startDate} mb={4}>
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
