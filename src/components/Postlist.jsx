import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Postcard from './Postcard'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { fetchPosts } from '../api/fetchPosts'
import Animated, { BounceInUp } from 'react-native-reanimated'
import PostcardSkeleton from './skeletons/PostcardSkeleton'
import AsyncStorage from '@react-native-async-storage/async-storage'

const baseUrl = process.env.EXPO_PUBLIC_API_URL

const Postlist = ({ navigation }) => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const getPosts = async () => {
        setLoading(true)
        try {
            const res = await fetchPosts()
            // console.log(res?.hasmore, 'res')
            setPosts(res?.data)
            console.log(posts)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <FlatList
            style={{ flex: 1, marginBottom: 1 }}
            data={posts}
            keyExtractor={(item) => item?._id}
            renderItem={({ item }) => (
                <Postcard
                    postData={item}
                    setPosts={setPosts}
                    navigation={navigation}
                    posts={posts}
                />
            )}
            ListFooterComponent={() => {
                return loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
            }}
            ListEmptyComponent={({ item }) => {
                return loading ? (
                    Array.from({ length: 10 }).map((_, i) => <PostcardSkeleton key={i} />)
                ) : (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: heightPercentageToDP('10%'),
                        }}
                    >
                        <Text>No posts to show</Text>
                    </View>
                )
            }}
            onRefresh={() => getPosts()}
            refreshing={loading}
            extraData={posts}
        />
    )
}

export default Postlist