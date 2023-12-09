import { View, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, Pressable, FlatList, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { userCover } from '../../assets'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { Commentcard, Deletemodal, UserButton } from '../components'
import { useDataStore } from '../store/store'
import { fetchUser } from '../api/fetchUser'
import AsyncStorage from '@react-native-async-storage/async-storage'

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const Postscreen = ({ route, navigation }) => {
    const { endpoint, title, userId, username, postId } = route?.params;


    const thisUser = useDataStore((state) => state.user)
    const { imageUrl, userName } = thisUser
    // console.log('this user', thisUser)
    const isAuthor = username === userName
    // console.log('is author', isAuthor)
    const [post, setPost] = useState(null)
    const [author, setAuthor] = useState(null)
    const [comment, setComment] = useState([])
    const [commentText, setCommentText] = useState('')
    const [modal, setModal] = useState(false)


    const getPost = async () => {
        // console.log('endpoint', endpoint)
        const url = `${baseUrl}/post/${endpoint}`
        try {
            const response = await axios.get(url)
            // console.log(response.data)
            setPost(response.data)
            const comments = response.data?.comment?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            setComment(comments)
        } catch (error) {
            console.log(error)
        }
    }

    const getUser = async () => {
        const userData = await AsyncStorage.getItem('userData')
        const user = JSON.parse(userData)
        // console.log('user', user?.access_token)
        try {
            const authorData = await axios.get(`${baseUrl}/user/getUser?id=${userId}`, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            })
            // console.log('author', authorData?.data)
            setAuthor(authorData?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPost()
    }, [setPost, setComment])

    useEffect(() => {
        getUser()
    }, [setAuthor])

    const handleComment = async () => {
        if (!commentText) return
        const userData = await AsyncStorage.getItem('userData')
        const user = await JSON.parse(userData)
        // console.log('user', user?.access_token)
        const options = {
            headers: {
                Authorization: `Bearer ${user?.access_token}`,
            }
        }
        try {
            const data = {
                "postId": postId,
                "content": commentText
            }
            // console.log('comment', postId, data)
            const response = await axios.patch(`${baseUrl}/post/comment`, data, options)
            console.log(response?.data?.comment, "comment response")
            const tempData = await response?.data?.comment?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            setComment(tempData)
        } catch (error) {
            console.log(JSON.stringify(error?.response))
        } finally {
            setCommentText('')
        }
    }

    const handleDeleteItem = async (id) => {
        const userData = await AsyncStorage.getItem('userData')
        const user = await JSON.parse(userData)
        console.log('user', user?.access_token)
        const requestOptions = {
            headers: {
                Authorization: `Bearer ${user?.access_token}`,
                'Content-Type': 'application/json'
            }
        }
        const data = {
            "postId": postId,
            "commentId": id
        }
        try {
            const response = await axios.delete(`${baseUrl}/post/deleteComment`, data, requestOptions)
            console.log(JSON.stringify(response), "delete response")
        } catch (error) {
            console.log(JSON.stringify(error?.response))
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-200 justify-center">
            <ScrollView className="flex-1">
                <View className="p-2 items-center relative">
                    <Image
                        // source={userCover}
                        source={{ uri: "https://fakeimg.pl/600x400" }}
                        style={{
                            height: heightPercentageToDP(25),
                            width: widthPercentageToDP(95),
                            resizeMode: 'cover',
                            borderWidth: 2,
                            borderColor: 'white',
                        }}
                    />
                    <View className="absolute -bottom-5 border-2 border-white rounded-full">
                        <UserButton
                            userImage={author?.imageUrl}
                            width={widthPercentageToDP(22)}
                            height={heightPercentageToDP(10)}
                        />
                    </View>
                </View>
                <View className="flex-row justify-center items-center mt-5">
                    <Text className="text-sm text-slate-600">From: </Text>
                    <Text className="text-sm text-indigo-500">{username}</Text>
                </View>
                <View className="my-2 bg-white rounded-sm">
                    <Text className="text-2xl font-semibold text-center">{post?.title}</Text>
                    <Text className="text-center text-slate-700 text-sm">{post?.content}</Text>
                </View>
                {/* Comments */}
                <View className="flex-1 justify-center items-center my-2">
                    <Text className="text-2xl font-semibold text-indigo-500 text-center">Comments</Text>
                    <FlatList
                        data={comment}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <>
                                <Commentcard
                                    commentData={item}
                                    isAuthor={isAuthor}
                                    userName={userName}
                                    navigation={navigation}
                                    setModal={setModal}
                                    setComment={setComment}
                                    postId={postId}
                                />
                                <Deletemodal
                                    modal={modal}
                                    setModal={setModal}
                                    onDelete={() => handleDeleteItem(item._id)}
                                    firstOption="Cancel"
                                    secondOption="Delete"
                                    message={"Are you sure you want to delete this comment?"}
                                />
                            </>
                        )}
                        extraData={this.state}
                        ListEmptyComponent={() => (
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-indigo-500 text-lg font-semibold">No comments yet</Text>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
            {/* Comment box */}
            <View className={`flex-row justify-center items-center bg-slate-200 border-t-[1px] ${isAuthor ? "border-indigo-500" : "border-slate-800"}`}>
                <TextInput
                    placeholder={`Comment as ${isAuthor ? "Author" : userName}`}
                    className={`w-4/5 h-10 bg-white rounded-sm px-3`}
                    onChangeText={setCommentText}
                    value={commentText}
                    keyboardType='default'
                    multiline={true}
                    numberOfLines={4}
                />
                <Pressable onPress={handleComment} className="w-1/5 h-10 bg-indigo-500 justify-center items-center">
                    <Text className="text-white text-sm">Post</Text>
                </Pressable>
            </View>
        </SafeAreaView >
    )
}

export default Postscreen