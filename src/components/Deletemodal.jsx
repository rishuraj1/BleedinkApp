import { View, Text, Modal, Pressable } from 'react-native'
import React from 'react'

const Deletemodal = ({ modal, setModal, onDelete, firstOption, secondOption, message }) => {
    return (
        <>
            {
                modal && (
                    <Modal transparent={true} visible={modal} animationType="fade">
                        <View style={{
                            backgroundColor: "rgba(0,0,0,0.5)",
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <View style={{
                                backgroundColor: "white",
                                width: "90%",
                                padding: 20,
                                borderRadius: 10
                            }}>
                                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Delete Comment</Text>
                                <Text style={{ fontSize: 16, marginBottom: 10 }}>{message}</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Pressable onPress={() => setModal(false)}>
                                        <Text style={{ fontSize: 16, color: "red", fontWeight: "bold" }}>{firstOption}</Text>
                                    </Pressable>
                                    <Pressable onPress={() => {
                                        onDelete()
                                        setModal(false)
                                    }}>
                                        <Text style={{ fontSize: 16, color: "green", fontWeight: "bold" }}>{secondOption}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )
            }
        </>
    )
}

export default Deletemodal