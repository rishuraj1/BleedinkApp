import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { userCover } from '../../assets'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { UserButton } from '../components'
import { useDataStore } from '../store/store'
import { fetchUser } from '../api/fetchUser'
import AsyncStorage from '@react-native-async-storage/async-storage'

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const Postscreen = ({ route }) => {
    const { endpoint, title, userId, username } = route?.params;


    const thisUser = useDataStore((state) => state.user)
    const { imageUrl, userName } = thisUser
    // console.log('this user', thisUser)
    const isAuthor = username === userName
    console.log('is author', isAuthor)
    const [post, setPost] = useState(null)
    const [author, setAuthor] = useState(null)

    const getPost = async () => {
        const url = `https://bloggler-backend.vercel.app/api/post/${endpoint}`
        try {
            const response = await axios.get(url)
            // console.log(response.data)
            setPost(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getUser = async () => {
        const userData = await AsyncStorage.getItem('userData')
        const user = JSON.parse(userData)
        try {
            const authorData = await axios.get(`${baseUrl}/user/getUser?id=${userId}`, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            })
            console.log('author', authorData?.data)
            setAuthor(authorData?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPost()
        console.log('post screen', post)
    }, [setPost])

    useEffect(() => {
        getUser()
    }, [setAuthor])

    return (
        <SafeAreaView className="flex-1 bg-slate-200">
            <ScrollView className="px-2">
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
                <View className="flex-row justify-center items-center mt-10">
                    <Text className="text-sm text-slate-600">From: </Text>
                    <Text className="text-sm text-indigo-500">{username}</Text>
                </View>
                <View className="mt-10 bg-white rounded-sm h-full">
                    <Text className="text-2xl font-semibold text-center">{post?.title}</Text>
                    <Text className="text-center text-slate-600 text-sm">{post?.content}</Text>
                </View>
            </ScrollView>
            {/* Comment box */}
            <View className={`flex-row justify-center items-center px-2 bg-white p-2`}>
                <UserButton
                    userImage={imageUrl}
                    width={widthPercentageToDP(10)}
                    height={heightPercentageToDP(5)}
                />
                <View className="flex-1">
                    <Text className="text-sm text-slate-600">Comment as: </Text>
                    <Text className="text-sm text-indigo-500">{userName}</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Postscreen