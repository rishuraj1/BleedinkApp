
import { View, Text, Pressable, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import UserButton from './UserButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useDataStore } from '../store/store';

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const Commentcard = ({ commentData, navigation, isAuthor, postId, setModal, modal, comment, setComment }) => {
    // console.log('comment data', commentData)
    // console.log('comment', comment)
    // console.log('user data', userData)
    const [commentorData, setCommentorData] = useState(null)
    const fetchUser = async () => {
        const userData = await AsyncStorage.getItem('userData')
        const user = JSON.parse(userData)
        // console.log('user', user?.access_token)
        try {
            const commentor = await axios.get(`${baseUrl}/user/getUser?id=${commentData?.createdBy}`, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            })
            // console.log('commentor', commentor?.data)
            const data = commentor?.data
            setCommentorData(data)
            // console.log('commentor', commentorData)
        } catch (error) {
            console.log(JSON.stringify(error?.response))
        }
    }

    const thisUser = useDataStore((state) => state.user)
    // console.log('this user', thisUser)

    const isCommentor = thisUser?.userName === commentorData?.userName
    // console.log('is commentor', isCommentor)


    useEffect(() => {
        fetchUser()
    }, [])

    const onDeleteComment = async () => {
        const userData = await AsyncStorage.getItem('userData')
        const user = await JSON.parse(userData)
        // console.log('user', user?.access_token)
        console.log('comment id', commentData?._id)
        console.log('post id', postId)
        try {
            const data = {
                "postId": postId,
                "commentId": commentData?._id
            }
            const options = {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                }
            }
            const response = await axios.delete(`${baseUrl}/post/deleteComment`, {
                ...options,
                data
            })
            console.log(JSON.stringify(response), "delete response")
            const updatedComments = comment?.filter((item) => item._id !== commentData?._id)
            setComment(updatedComments)
        } catch (error) {
            console.log(JSON.stringify(error?.response), "ok this is the one")
        } finally {
            setModal(false)
        }
    }

    return (
        <View className="bg-white p-2 my-2" style={{
            width: widthPercentageToDP(96),
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1
            },
            shadowOpacity: 0.25,
            shadowRadius: 2,
            elevation: 1
        }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", alignItems: "center" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <UserButton
                        userImage={commentorData?.imageUrl}
                        onPress={() => navigation.navigate('Profile', {
                            username: commentorData?.userName,
                            userId: commentorData?._id,
                        })}
                        width={heightPercentageToDP(6)}
                        height={heightPercentageToDP(6)}
                    />
                    <Text style={{ marginLeft: 5, fontSize: heightPercentageToDP(2) }} className="text-indigo-500">
                        {commentorData?.userName}
                    </Text>
                </View>
                {
                    (isAuthor || isCommentor) &&
                    <TouchableOpacity onPress={() => {
                        onDeleteComment()
                    }}>
                        <MaterialCommunityIcons name="delete-empty" size={24} color="red" />
                    </TouchableOpacity>
                }
            </View>
            <Text style={{ marginLeft: 5, fontSize: heightPercentageToDP(2) }} className="text-slate-600">
                {commentData?.content}
            </Text>
            {/* delete modal */}
            {/* {
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
                                <Text style={{ fontSize: 16, marginBottom: 10 }}>Are you sure you want to delte this comment</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Pressable onPress={() => setModal(false)}>
                                        <Text style={{ fontSize: 16, color: "red", fontWeight: "bold" }}>Cancel</Text>
                                    </Pressable>
                                    <Pressable onPress={() => {
                                        onDeleteComment()
                                    }}>
                                        <Text style={{ fontSize: 16, color: "green", fontWeight: "bold" }}>Delete</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )
            } */}
        </View>
    )
}

export default Commentcard