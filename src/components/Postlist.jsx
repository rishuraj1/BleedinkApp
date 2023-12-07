import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Postcard from './Postcard'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { fetchPosts } from '../api/fetchPosts'
import Animated, { BounceInUp } from 'react-native-reanimated'
import PostcardSkeleton from './skeletons/PostcardSkeleton'

const Postlist = ({ navigation }) => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const getPosts = async () => {
        setLoading(true)
        try {
            const res = await fetchPosts()
            setPosts(res?.data)
            setLoading(false)
            // console.log(posts)
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
            renderItem={({ item }) => <Postcard postData={item} navigation={navigation} />}
            ListFooterComponent={() => {
                return loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
            }}
            ListEmptyComponent={({ item }) => {
                return loading ? (
                    <PostcardSkeleton item={item} />
                ) : null
            }}
            onRefresh={() => getPosts()}
            refreshing={loading}
        />
    )
}

export default Postlist