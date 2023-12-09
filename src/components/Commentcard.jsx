
import { View, Text, Pressable, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import UserButton from './UserButton';
import { AntDesign, FontAwesome5, Feather, Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useDataStore } from '../store/store';

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const Commentcard = ({ commentData, navigation, isAuthor, postId, setModal, onDelete }) => {
    // console.log('comment data', commentData)
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
            console.log('commentor', commentorData)
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
                        // onPress={() => navigation.navigate('Profile', {
                        //   username: postData?.createdBy?.userName,
                        //   userId: postData?.createdBy?._id,
                        // })}
                        width={heightPercentageToDP(6)}
                        height={heightPercentageToDP(6)}
                    />
                    <Text style={{ marginLeft: 5, fontSize: heightPercentageToDP(2) }} className="text-indigo-500">
                        {commentorData?.userName}
                    </Text>
                </View>
                {
                    (isAuthor || isCommentor) &&
                    <TouchableOpacity onPress={() => setModal(true)}>
                        <Ionicons name="ellipsis-vertical" size={24} color="black" />
                    </TouchableOpacity>
                }
            </View>
            <Text style={{ marginLeft: 5, fontSize: heightPercentageToDP(2) }} className="text-slate-600">
                {commentData?.content}
            </Text>
        </View>
    )
}

export default Commentcard