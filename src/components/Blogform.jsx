import { View, Text, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Form, TextArea } from 'tamagui'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { Button, MyTooltip } from '../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const Blogform = ({ navigation }) => {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [btnDisabled, setBtnDisabled] = useState(true)

  useEffect(() => {
    const getBlogData = async () => {
      const currUser = JSON.parse(await AsyncStorage.getItem('userData'))
      // currUser = JSON.parse(currUser)
      console.log(currUser, "user")
      let blogData = JSON.parse(await AsyncStorage.getItem('blogData'))
      // console.log(blogData, "blogddata")
      if (blogData && blogData?.userId === currUser?.userId) {
        const { blogTitle, blogContent } = JSON.parse(blogData)
        setTitle(blogTitle)
        setContent(blogContent)
      } else {
        setTitle('')
        setContent('')
      }
    }
    getBlogData()
  }, [])

  useEffect(() => {
    if (title.length > 0 && content.length > 0) {
      setBtnDisabled(false)
    } else {
      setBtnDisabled(true)
    }
  }, [setContent, title, content, setTitle])


  const handleSubmit = async (e) => {
    if (btnDisabled) return
    setIsSubmitted(true)
    e.preventDefault()
    // console.log('submitted')
    try {
      const url = "https://bloggler-backend.vercel.app/api/post"
      const data = JSON.stringify({
        "title": title,
        "content": content
      })
      console.log(data)
      const userToken = JSON.parse(await AsyncStorage.getItem('userData'))
      console.log(userToken?.access_token, "userToken")
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${userToken?.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log(response?.status, "response")
      if (response?.status === 200) {
        window.alert("Blog post created successfully")
        await AsyncStorage.removeItem('blogData')
        navigation.navigate('Home')
      }
    } catch (error) {
      window.alert("Something went wrong, please try again later or login again")
    } finally {
      setIsSubmitted(false)
    }
  }

  return (
    <View>
      <Form onSubmit={handleSubmit}>
        <Text className="text-slate-800 text-xl font-semibold">Blog Title</Text>
        <TextInput
          onChangeText={setTitle}
          value={title}
          placeholder='Enter blog title...'
          style={{
            height: heightPercentageToDP('5%'),
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 20,
            padding: 10,
            backgroundColor: 'white',
            fontSize: heightPercentageToDP('2.5%'),
            borderRadius: 5,
            width: widthPercentageToDP('100%')

          }}
        />
        <Text className="text-slate-800 text-xl font-semibold">Blog Content</Text>
        <TextArea
          onChangeText={setContent}
          value={content}
          placeholder='Write your blog here...'
          height={heightPercentageToDP('30%')}
          textAlign='left'
          alignItems='flex-start'
          marginBottom={20}
          style={{
            borderColor: 'gray',
            borderWidth: 1,
            padding: 10,
            backgroundColor: 'white',
            fontSize: heightPercentageToDP('2.5%'),
            borderRadius: 5,
            width: widthPercentageToDP('100%')
          }}
        />
        <Form.Trigger asChild>
          <Button
            type="submit"
            bgcolor={`${btnDisabled ? 'gray' : 'blue'}`}
            width={"100%"}
            disabled={btnDisabled}
            style={{
              PointerEvent: `${btnDisabled ? 'none' : 'auto'}`
            }}
          >
            {btnDisabled ? 'Please fill in all fields' : `${isSubmitted ? 'Loading...' : 'Submit'}`}
          </Button>
        </Form.Trigger>
      </Form>
      <MyTooltip />
    </View>
  )
}

export default Blogform