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
} from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { useAppDispatch } from '../store/hooks'
import { addUser } from '../store/users.reducer'

type AddUserData = {
  name: string
}

export const AddUserModal: React.FC<UseDisclosureReturn> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserData>({
    mode: 'onBlur',
  })

  const closeModal = useCallback(() => {
    onClose()
    reset()
  }, [onClose, reset])

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a user</ModalHeader>
        <ModalCloseButton />

        <form
          onSubmit={handleSubmit((data) => {
            dispatch(
              addUser({
                user: {
                  name: data.name,
                },
              })
            )
            closeModal()
          })}
        >
          <ModalBody>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                id="name"
                placeholder="Type your name"
                {...register('name', { required: true })}
              />
              {errors.name?.type === 'required' && (
                <FormErrorMessage>Name is required</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
