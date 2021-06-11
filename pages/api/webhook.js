// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios"

const isActionOpen = body => body.object_attributes.action === 'open'

const isReqSafe = req => req.headers['x-gitlab-token'] === process.env.GITLAB_SECRET_TOKEN

const mountTextMessage = body => {
  return {text: `### Novo MR
  | Autor | MR |
  |-|-|
  | ${body.user.username} | [${body.object_attributes.title}](${body.object_attributes.url}) |
  `}
}

const getMmHook = reqBody => {
  const namespace = reqBody.project.namespace

  if(namespace === process.env.BACKEND_NAMESPACE) {
    return process.env.BACKEND_MM_HOOK
  } else if (namespace === process.env.FRONTEND_NAMESPACE) {
    return process.env.FRONTEND_MM_HOOK
  } else {
    throw 'Unknow namespace'
  }
}

const sendTextMessage = async reqBody => {
  const textMessage = mountTextMessage(reqBody)
  console.log(textMessage.text.length)

  const mmHook = getMmHook(reqBody)

  await axios.post(mmHook, textMessage)
}

export default async (req, res) => {
  try {
    const reqBody = req.body
  
    if(!isReqSafe(req)) {
      throw 'Request is not safe'
    }
  
    if(isActionOpen(reqBody)) {
      await sendTextMessage(reqBody)
    }

    res.send()
  } catch (err) {
    console.error(err)
    res.status(403).send()
  }
}
