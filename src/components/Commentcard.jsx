
import { View, Text, Pressable, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import UserButton from './UserButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useDataStore } from '../store/store';
import Timeparser from './Timeparser';

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
        <View style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            padding: 5,
            marginVertical: 1,
            borderRadius: 5,
            width: widthPercentageToDP(100),
        }}>
            <View style={{ marginTop: 6, marginRight: 2 }}>
                <UserButton
                    userImage={commentorData?.imageUrl}
                    onPress={() => navigation.navigate('Profile', {
                        username: commentorData?.userName,
                        userId: commentorData?._id,
                    })}
                    width={heightPercentageToDP(6)}
                    height={heightPercentageToDP(6)}
                />
            </View>
            <View className="bg-white p-2 my-2 mr-auto" style={{
                width: widthPercentageToDP(83),
                borderRadius: 5,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1
                },
                shadowOpacity: 0.25,
                shadowRadius: 2,
                elevation: 1,
                flexDirection: "column",
                justifyContent: "space-between",
            }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                    <Text style={{ marginLeft: 5, fontSize: heightPercentageToDP(2) }} className="text-indigo-500">
                        {commentorData?.userName}
                    </Text>
                    {
                        (isAuthor || isCommentor) &&
                        <TouchableOpacity className="ml-auto" onPress={() => {
                            onDeleteComment()
                        }}>
                            <MaterialCommunityIcons name="delete-empty" size={24} color="red" />
                        </TouchableOpacity>
                    }
                </View>
                <Text style={{ marginLeft: 5, fontSize: heightPercentageToDP(2) }} className="text-slate-600">
                    {commentData?.content}
                </Text>
                <Text style={{ marginLeft: 5, fontSize: heightPercentageToDP(1.5), marginTop: 3, alignItems: "flex-end", flex: 1 }} className="text-slate-600">
                    <Timeparser timestamp={commentData?.createdAt} />
                </Text>
            </View>
        </View >
    )
}

export default Commentcard