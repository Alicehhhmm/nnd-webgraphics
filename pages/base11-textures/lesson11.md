# Textures

[ThreeJS 官方](https://threejs.org/docs/index.html#api/zh/constants/Textures)

笔记内容涞源: [Journey](https://threejs-journey.com/#table-of-content)

> 本节主要是一些常见材质的使用说明，以及不同材质类型在不同情况的使用以及作用。

对应材质类型效果大致如下：

- Alpha(阿尔法)
  ![Alt text](/public/assets/textures/base11-texture/door/alpha.jpg)

<br/>

- Height(灰度图像)
  灰度图像：通过渲染移动顶点以创建一些浮雕, 将物体的细节进一步勾勒出来。（用于处理纹理细节）

![Alt text](/public/assets/textures/base11-texture/door/height.jpg)

<br/>

- Normal
  该材质主要用于处理光线照射到不同平面时，产生的不同效果。它适合添加在具有大量细节的高度纹理物体的光照调节。（用于处理光照细节）

  ![Alt text](/public/assets/textures/base11-texture/door/normal.jpg)
  <br/>

- Ambient Occlusion（环境光遮蔽）
  在裂缝中添加假阴影，让物体的纹理细节在视觉效果上更逼真，有助于创造对比和凸显纹理的凹凸性
  （用于处理纹理裂缝阴影）
  ![Alt text](/public/assets/textures/base11-texture/door/ambientOcclusion.jpg)
  <br/>

- Metalness(金属感)
  类似灰度图像,
  白色部分是金属色,
  黑色是非金属的主要是为了反射光泽
  （如果是金属，它会起到反射金属光泽的作用）
  ![Alt text](/public/assets/textures/base11-texture/door/metalness.jpg)
  <br/>

- Roughness(粗糙度)
  通过它能让金属质感与灰度图像显现的更好。
  黑色表示光滑的部分，
  白色是表示粗糙的部分，
  他主要是用于光耗散，如果光线很粗糙就会分散光线，以确保光线反射更完美（反射越好，效果越光滑）
  (用于光泽色散处理)
  ![Alt text](/public/assets/textures/base11-texture/door/roughness.jpg)
  <br/>

  附录：

  - [《基于物理渲染的基本理论》](https://marmoset.co/posts/basic-theory-of-physically-based-rendering/)

  - [《基于物理渲染的应用实践》](https://marmoset.co/posts/physically-based-rendering-and-you-can-too/)
