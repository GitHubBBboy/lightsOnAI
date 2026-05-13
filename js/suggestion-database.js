const suggestionDatabase = {
  face_dark: [
    {
      id: 'face_dark_l1_001',
      problemType: 'face_dark',
      level: 1,
      scenario: ['selfie', 'portrait', 'video'],
      text: {
        zh: '面向光源站立，让光线直接照射到面部',
        en: 'Face the light source to let light directly illuminate your face',
      },
      params: {
        position: {
          description: { zh: '面向光源', en: 'Face the light source' },
          angle: 0,
          distance: null,
        },
        action: {
          description: { zh: '调整站位', en: 'Adjust your position' },
          steps: {
            zh: ['找到光源位置（窗户、灯光）', '身体转向光源方向', '面部正对光源'],
            en: [
              'Find the light source (window, lamp)',
              'Turn your body toward the light',
              'Face the light directly',
            ],
          },
        },
        intensity: null,
      },
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: false,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'free',
        effectiveness: 0.8,
        tags: { zh: ['零成本', '简单', '快速'], en: ['Free', 'Easy', 'Quick'] },
      },
    },
    {
      id: 'face_dark_l1_002',
      problemType: 'face_dark',
      level: 1,
      scenario: ['selfie', 'portrait', 'video'],
      text: {
        zh: '靠近窗户或光源，利用自然光补光',
        en: 'Move closer to windows or light sources for natural fill light',
      },
      params: {
        position: {
          description: { zh: '靠近光源', en: 'Close to light source' },
          angle: 0,
          distance: { zh: '0.5-1米', en: '0.5-1m' },
        },
        action: {
          description: { zh: '移动位置', en: 'Move position' },
          steps: {
            zh: ['识别最近的光源', '向光源方向移动', '保持面部朝向光源'],
            en: [
              'Identify the nearest light source',
              'Move toward the light',
              'Keep facing the light',
            ],
          },
        },
        intensity: null,
      },
      conditions: {
        indoor: true,
        outdoor: false,
        daytime: true,
        nighttime: false,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'free',
        effectiveness: 0.75,
        tags: { zh: ['零成本', '简单'], en: ['Free', 'Easy'] },
      },
    },
    {
      id: 'face_dark_l1_003',
      problemType: 'face_dark',
      level: 1,
      scenario: ['selfie', 'portrait'],
      text: {
        zh: '用白纸或白色墙壁反射光线到面部',
        en: 'Use white paper or wall to reflect light onto your face',
      },
      params: {
        position: {
          description: { zh: '反射面位于面部下方', en: 'Reflective surface below face' },
          angle: -30,
          distance: { zh: '0.3-0.5米', en: '0.3-0.5m' },
        },
        action: {
          description: { zh: '使用反光物', en: 'Use reflective object' },
          steps: {
            zh: ['找一张白纸或白色物体', '放置在面部下方', '调整角度反射光线'],
            en: [
              'Find white paper or object',
              'Place below your face',
              'Adjust angle to reflect light',
            ],
          },
        },
        intensity: null,
      },
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'medium',
        cost: 'free',
        effectiveness: 0.7,
        tags: { zh: ['零成本', '需要道具'], en: ['Free', 'Requires prop'] },
      },
    },
    {
      id: 'face_dark_l2_001',
      problemType: 'face_dark',
      level: 2,
      scenario: ['selfie'],
      text: {
        zh: '使用手机手电筒从侧面补光',
        en: 'Use phone flashlight to fill light from the side',
      },
      params: {
        position: {
          description: { zh: '侧面45度角', en: '45° from side' },
          angle: 45,
          distance: { zh: '0.5-1米', en: '0.5-1m' },
        },
        action: {
          description: { zh: '手机补光', en: 'Phone fill light' },
          steps: {
            zh: ['打开另一部手机的手电筒', '从侧面45度角照射面部', '调整距离控制亮度'],
            en: [
              "Turn on another phone's flashlight",
              'Shine from 45° angle',
              'Adjust distance for brightness',
            ],
          },
        },
        intensity: 0.6,
      },
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'medium',
        cost: 'low',
        effectiveness: 0.85,
        tags: { zh: ['低成本', '需要手机'], en: ['Low cost', 'Requires phone'] },
      },
    },
    {
      id: 'face_dark_l2_002',
      problemType: 'face_dark',
      level: 2,
      scenario: ['portrait', 'video'],
      text: {
        zh: '使用台灯或落地灯从正面补光',
        en: 'Use desk lamp or floor lamp to fill light from the front',
      },
      params: {
        position: {
          description: { zh: '正面略高于面部', en: 'Front, slightly above face' },
          angle: 0,
          distance: { zh: '1-1.5米', en: '1-1.5m' },
        },
        action: {
          description: { zh: '台灯补光', en: 'Lamp fill light' },
          steps: {
            zh: ['将台灯放在面部正前方', '灯头略高于面部向下倾斜', '调整亮度避免过曝'],
            en: [
              'Place lamp in front of face',
              'Angle light slightly downward',
              'Adjust brightness to avoid overexposure',
            ],
          },
        },
        intensity: 0.7,
      },
      conditions: {
        indoor: true,
        outdoor: false,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'low',
        effectiveness: 0.8,
        tags: { zh: ['低成本', '需要台灯'], en: ['Low cost', 'Requires lamp'] },
      },
    },
    {
      id: 'face_dark_l3_001',
      problemType: 'face_dark',
      level: 3,
      scenario: ['portrait', 'video'],
      text: {
        zh: '使用环形灯放置在正前方，距离面部30-50cm',
        en: 'Use ring light placed in front, 30-50cm from face',
      },
      params: {
        position: {
          description: { zh: '正前方', en: 'Directly in front' },
          angle: 0,
          distance: { zh: '0.3-0.5米', en: '0.3-0.5m' },
        },
        action: {
          description: { zh: '环形灯布光', en: 'Ring light setup' },
          steps: {
            zh: ['将环形灯放在相机后方', '调整高度与面部平齐', '亮度调至60-80%'],
            en: [
              'Place ring light behind camera',
              'Adjust height to face level',
              'Set brightness to 60-80%',
            ],
          },
        },
        intensity: 0.8,
      },
      conditions: {
        indoor: true,
        outdoor: false,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'medium',
        effectiveness: 0.95,
        tags: { zh: ['专业设备', '环形灯'], en: ['Professional', 'Ring light'] },
      },
    },
    {
      id: 'face_dark_l3_002',
      problemType: 'face_dark',
      level: 3,
      scenario: ['portrait'],
      text: {
        zh: '使用主灯+辅灯布光：主灯45度侧光，辅灯填充阴影',
        en: 'Use key light + fill light: key at 45°, fill to shadow areas',
      },
      params: {
        position: {
          description: {
            zh: '主灯45度侧光，辅灯对侧填充',
            en: 'Key light at 45°, fill light on opposite side',
          },
          angle: 45,
          distance: { zh: '主灯1-1.5米，辅灯1.5-2米', en: 'Key: 1-1.5m, Fill: 1.5-2m' },
        },
        action: {
          description: { zh: '双灯布光', en: 'Two-light setup' },
          steps: {
            zh: [
              '主灯放在侧面45度角，距离1-1.5米',
              '辅灯放在对侧，距离1.5-2米',
              '主灯亮度100%，辅灯亮度50-70%',
            ],
            en: [
              'Key light at 45° angle, 1-1.5m away',
              'Fill light on opposite side, 1.5-2m away',
              'Key at 100%, fill at 50-70%',
            ],
          },
        },
        intensity: 0.9,
      },
      conditions: {
        indoor: true,
        outdoor: false,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'hard',
        cost: 'high',
        effectiveness: 0.98,
        tags: { zh: ['专业设备', '双灯布光'], en: ['Professional', 'Two-light setup'] },
      },
    },
  ],

  asymmetry: [
    {
      id: 'asymmetry_l1_001',
      problemType: 'asymmetry',
      level: 1,
      scenario: ['selfie', 'portrait', 'video'],
      text: {
        zh: '转动身体，让光线更均匀地照射面部',
        en: 'Rotate your body for more even light distribution',
      },
      params: {
        position: {
          description: { zh: '身体转向亮侧', en: 'Turn body toward brighter side' },
          angle: 15,
          distance: null,
        },
        action: {
          description: { zh: '调整身体角度', en: 'Adjust body angle' },
          steps: {
            zh: ['识别亮侧和暗侧', '身体向亮侧转动15-30度', '保持面部朝向相机'],
            en: [
              'Identify bright and dark sides',
              'Turn body 15-30° toward bright side',
              'Keep face toward camera',
            ],
          },
        },
        intensity: null,
      },
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'free',
        effectiveness: 0.7,
        tags: { zh: ['零成本', '简单'], en: ['Free', 'Easy'] },
      },
    },
    {
      id: 'asymmetry_l1_002',
      problemType: 'asymmetry',
      level: 1,
      scenario: ['selfie', 'portrait'],
      text: {
        zh: '用白纸或反光物反射光线到阴影侧',
        en: 'Use white paper or reflector to bounce light to shadow side',
      },
      params: {
        position: {
          description: { zh: '反射面位于阴影侧', en: 'Reflector on shadow side' },
          angle: -45,
          distance: { zh: '0.3-0.5米', en: '0.3-0.5m' },
        },
        action: {
          description: { zh: '反射补光', en: 'Reflect light' },
          steps: {
            zh: ['找白色物体或反光物', '放在阴影侧面部旁边', '调整角度反射光线'],
            en: [
              'Find white object or reflector',
              'Place next to shadow side of face',
              'Adjust angle to reflect light',
            ],
          },
        },
        intensity: null,
      },
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'medium',
        cost: 'free',
        effectiveness: 0.75,
        tags: { zh: ['零成本', '需要道具'], en: ['Free', 'Requires prop'] },
      },
    },
    {
      id: 'asymmetry_l2_001',
      problemType: 'asymmetry',
      level: 2,
      scenario: ['selfie'],
      text: {
        zh: '使用手机手电筒从阴影侧补光',
        en: 'Use phone flashlight to fill light from shadow side',
      },
      params: {
        position: {
          description: { zh: '阴影侧45度角', en: '45° from shadow side' },
          angle: 45,
          distance: { zh: '0.5-1米', en: '0.5-1m' },
        },
        action: {
          description: { zh: '手机补光', en: 'Phone fill light' },
          steps: {
            zh: ['打开手机手电筒', '从阴影侧45度角照射', '调整距离控制亮度'],
            en: [
              'Turn on phone flashlight',
              'Shine from 45° on shadow side',
              'Adjust distance for brightness',
            ],
          },
        },
        intensity: 0.5,
      },
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'medium',
        cost: 'low',
        effectiveness: 0.85,
        tags: { zh: ['低成本', '需要手机'], en: ['Low cost', 'Requires phone'] },
      },
    },
    {
      id: 'asymmetry_l2_002',
      problemType: 'asymmetry',
      level: 2,
      scenario: ['portrait', 'video'],
      text: {
        zh: '使用台灯从阴影侧补光，亮度适中',
        en: 'Use desk lamp from shadow side at moderate brightness',
      },
      params: {
        position: {
          description: { zh: '阴影侧正面', en: 'Front of shadow side' },
          angle: 0,
          distance: { zh: '1-1.5米', en: '1-1.5m' },
        },
        action: {
          description: { zh: '台灯补光', en: 'Lamp fill light' },
          steps: {
            zh: ['将台灯放在阴影侧', '灯头朝向面部阴影区域', '亮度调至中等'],
            en: [
              'Place lamp on shadow side',
              'Aim light at shadow area',
              'Set to medium brightness',
            ],
          },
        },
        intensity: 0.6,
      },
      conditions: {
        indoor: true,
        outdoor: false,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'low',
        effectiveness: 0.8,
        tags: { zh: ['低成本', '需要台灯'], en: ['Low cost', 'Requires lamp'] },
      },
    },
    {
      id: 'asymmetry_l3_001',
      problemType: 'asymmetry',
      level: 3,
      scenario: ['portrait', 'video'],
      text: {
        zh: '使用补光灯填充阴影侧，亮度为主光源的50-70%',
        en: 'Use fill light on shadow side at 50-70% of key light intensity',
      },
      params: {
        position: {
          description: { zh: '阴影侧正面', en: 'Front of shadow side' },
          angle: 0,
          distance: { zh: '1-1.5米', en: '1-1.5m' },
        },
        action: {
          description: { zh: '专业补光', en: 'Professional fill light' },
          steps: {
            zh: ['在阴影侧放置补光灯', '灯头朝向面部阴影区域', '亮度调至主光源的50-70%'],
            en: [
              'Place fill light on shadow side',
              'Aim at shadow area',
              'Set to 50-70% of key light',
            ],
          },
        },
        intensity: 0.6,
      },
      conditions: {
        indoor: true,
        outdoor: false,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'medium',
        cost: 'medium',
        effectiveness: 0.95,
        tags: { zh: ['专业设备', '补光灯'], en: ['Professional', 'Fill light'] },
      },
    },
  ],

  top_light: [
    {
      id: 'top_light_l1_001',
      problemType: 'top_light',
      level: 1,
      scenario: ['selfie', 'portrait', 'video'],
      text: {
        zh: '移到阴影处或室内，避免顶光直射',
        en: 'Move to shade or indoors to avoid direct overhead light',
      },
      params: {
        position: {
          description: { zh: '阴影处或室内', en: 'Shade or indoors' },
          angle: null,
          distance: null,
        },
        action: {
          description: { zh: '改变位置', en: 'Change location' },
          steps: {
            zh: ['寻找树荫、建筑阴影或室内', '确保顶光不直射面部', '保持环境光线均匀'],
            en: [
              'Find tree shade, building shadow, or indoors',
              'Ensure no direct overhead light',
              'Keep ambient light even',
            ],
          },
        },
        intensity: null,
      },
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: false,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'free',
        effectiveness: 0.85,
        tags: { zh: ['零成本', '简单'], en: ['Free', 'Easy'] },
      },
    },
    {
      id: 'top_light_l1_002',
      problemType: 'top_light',
      level: 1,
      scenario: ['selfie', 'portrait'],
      text: {
        zh: '微微抬头，减少眼窝和鼻下的阴影',
        en: 'Tilt head up slightly to reduce shadows under eyes and nose',
      },
      params: {
        position: {
          description: { zh: '抬头15-20度', en: 'Tilt head up 15-20°' },
          angle: 15,
          distance: null,
        },
        action: {
          description: { zh: '调整头部角度', en: 'Adjust head angle' },
          steps: {
            zh: ['微微抬起下巴', '保持面部朝向光源', '避免过度抬头显得不自然'],
            en: [
              'Lift chin slightly',
              'Keep face toward light source',
              'Avoid over-tilting for natural look',
            ],
          },
        },
        intensity: null,
      },
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'free',
        effectiveness: 0.65,
        tags: { zh: ['零成本', '简单'], en: ['Free', 'Easy'] },
      },
    },
    {
      id: 'top_light_l2_001',
      problemType: 'top_light',
      level: 2,
      scenario: ['selfie', 'portrait'],
      text: {
        zh: '使用帽子或遮阳物柔化顶部光线',
        en: 'Use hat or sunshade to soften overhead light',
      },
      params: {
        position: {
          description: { zh: '帽子或遮阳物', en: 'Hat or sunshade' },
          angle: null,
          distance: null,
        },
        action: {
          description: { zh: '使用遮阳物', en: 'Use sunshade' },
          steps: {
            zh: ['戴上宽檐帽或使用遮阳伞', '确保阴影覆盖整个面部', '调整角度避免遮挡眼睛'],
            en: [
              'Wear wide-brim hat or use umbrella',
              'Ensure shadow covers entire face',
              'Adjust angle to avoid covering eyes',
            ],
          },
        },
        intensity: null,
      },
      conditions: {
        indoor: false,
        outdoor: true,
        daytime: true,
        nighttime: false,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'low',
        effectiveness: 0.75,
        tags: { zh: ['低成本', '需要道具'], en: ['Low cost', 'Requires prop'] },
      },
    },
    {
      id: 'top_light_l2_002',
      problemType: 'top_light',
      level: 2,
      scenario: ['portrait', 'video'],
      text: {
        zh: '使用反光板从下方反射光线填充阴影',
        en: 'Use reflector from below to bounce light into shadows',
      },
      params: {
        position: {
          description: { zh: '反射面位于面部下方', en: 'Reflector below face' },
          angle: -45,
          distance: { zh: '0.5-1米', en: '0.5-1m' },
        },
        action: {
          description: { zh: '反射补光', en: 'Reflect light' },
          steps: {
            zh: ['将反光板放在面部下方', '调整角度反射光线到阴影区域', '控制反射强度避免过亮'],
            en: [
              'Place reflector below face',
              'Adjust angle to reflect light into shadows',
              'Control intensity to avoid over-brightening',
            ],
          },
        },
        intensity: 0.5,
      },
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'medium',
        cost: 'low',
        effectiveness: 0.8,
        tags: { zh: ['低成本', '需要反光板'], en: ['Low cost', 'Requires reflector'] },
      },
    },
    {
      id: 'top_light_l3_001',
      problemType: 'top_light',
      level: 3,
      scenario: ['portrait', 'video'],
      text: {
        zh: '使用柔光箱或柔光罩柔化顶部光线',
        en: 'Use softbox or diffuser to soften overhead light',
      },
      params: {
        position: {
          description: { zh: '顶部光源加装柔光设备', en: 'Add diffuser to overhead light' },
          angle: null,
          distance: { zh: '0.5-1米', en: '0.5-1m' },
        },
        action: {
          description: { zh: '柔化光线', en: 'Diffuse light' },
          steps: {
            zh: ['在顶部光源前加装柔光箱或柔光罩', '调整柔光设备与面部的距离', '确保光线均匀柔和'],
            en: [
              'Attach softbox or diffuser to overhead light',
              'Adjust distance from face',
              'Ensure even, soft light',
            ],
          },
        },
        intensity: 0.7,
      },
      conditions: {
        indoor: true,
        outdoor: false,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'medium',
        cost: 'medium',
        effectiveness: 0.9,
        tags: { zh: ['专业设备', '柔光设备'], en: ['Professional', 'Diffuser'] },
      },
    },
  ],

  low_light: [
    {
      id: 'low_light_l1_001',
      problemType: 'low_light',
      level: 1,
      scenario: ['selfie', 'portrait', 'video'],
      text: {
        zh: '移至更明亮的环境，如靠近窗户或灯光',
        en: 'Move to a brighter environment, such as near windows or lights',
      },
      params: {
        position: {
          description: { zh: '明亮环境', en: 'Brighter environment' },
          angle: null,
          distance: null,
        },
        action: {
          description: { zh: '改变位置', en: 'Change location' },
          steps: {
            zh: ['寻找更明亮的环境', '靠近窗户或光源', '确保面部有足够光线'],
            en: [
              'Find a brighter environment',
              'Move closer to windows or lights',
              'Ensure sufficient light on face',
            ],
          },
        },
        intensity: null,
      },
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'free',
        effectiveness: 0.85,
        tags: { zh: ['零成本', '简单'], en: ['Free', 'Easy'] },
      },
    },
    {
      id: 'low_light_l1_002',
      problemType: 'low_light',
      level: 1,
      scenario: ['selfie', 'portrait'],
      text: {
        zh: '打开室内所有灯光，增加整体亮度',
        en: 'Turn on all indoor lights to increase overall brightness',
      },
      params: {
        position: {
          description: { zh: '室内灯光全开', en: 'All indoor lights on' },
          angle: null,
          distance: null,
        },
        action: {
          description: { zh: '增加环境光', en: 'Increase ambient light' },
          steps: {
            zh: ['打开房间内所有灯光', '确保光线从多个方向照射', '避免单一光源造成阴影'],
            en: [
              'Turn on all lights in the room',
              'Ensure light from multiple directions',
              'Avoid single light source shadows',
            ],
          },
        },
        intensity: null,
      },
      conditions: {
        indoor: true,
        outdoor: false,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'free',
        effectiveness: 0.75,
        tags: { zh: ['零成本', '简单'], en: ['Free', 'Easy'] },
      },
    },
    {
      id: 'low_light_l2_001',
      problemType: 'low_light',
      level: 2,
      scenario: ['selfie'],
      text: {
        zh: '使用手机屏幕作为补光源',
        en: 'Use phone screen as fill light source',
      },
      params: {
        position: {
          description: { zh: '手机屏幕朝向面部', en: 'Phone screen facing face' },
          angle: 0,
          distance: { zh: '0.3-0.5米', en: '0.3-0.5m' },
        },
        action: {
          description: { zh: '屏幕补光', en: 'Screen fill light' },
          steps: {
            zh: ['将手机屏幕亮度调至最高', '打开白色背景图片或网页', '将屏幕朝向面部补光'],
            en: [
              'Set phone screen to max brightness',
              'Open white background image or webpage',
              'Face screen toward your face',
            ],
          },
        },
        intensity: 0.4,
      },
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'free',
        effectiveness: 0.7,
        tags: { zh: ['零成本', '需要手机'], en: ['Free', 'Requires phone'] },
      },
    },
    {
      id: 'low_light_l2_002',
      problemType: 'low_light',
      level: 2,
      scenario: ['selfie', 'portrait'],
      text: {
        zh: '使用手机手电筒或台灯补光',
        en: 'Use phone flashlight or desk lamp for fill light',
      },
      params: {
        position: {
          description: { zh: '正面或侧面45度', en: 'Front or 45° from side' },
          angle: 45,
          distance: { zh: '0.5-1米', en: '0.5-1m' },
        },
        action: {
          description: { zh: '人工补光', en: 'Artificial fill light' },
          steps: {
            zh: ['打开手机手电筒或台灯', '从正面或侧面照射面部', '调整距离控制亮度'],
            en: [
              'Turn on phone flashlight or desk lamp',
              'Shine from front or side onto face',
              'Adjust distance for brightness',
            ],
          },
        },
        intensity: 0.6,
      },
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'low',
        effectiveness: 0.8,
        tags: { zh: ['低成本', '需要设备'], en: ['Low cost', 'Requires equipment'] },
      },
    },
    {
      id: 'low_light_l3_001',
      problemType: 'low_light',
      level: 3,
      scenario: ['portrait', 'video'],
      text: {
        zh: '使用专业LED补光灯，亮度可调',
        en: 'Use professional LED fill light with adjustable brightness',
      },
      params: {
        position: {
          description: { zh: '正面或侧面', en: 'Front or side' },
          angle: 45,
          distance: { zh: '1-2米', en: '1-2m' },
        },
        action: {
          description: { zh: '专业补光', en: 'Professional fill light' },
          steps: {
            zh: ['设置LED补光灯', '调整亮度和色温', '确保光线均匀照射面部'],
            en: [
              'Set up LED fill light',
              'Adjust brightness and color temperature',
              'Ensure even light on face',
            ],
          },
        },
        intensity: 0.8,
      },
      conditions: {
        indoor: true,
        outdoor: false,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'medium',
        cost: 'medium',
        effectiveness: 0.95,
        tags: { zh: ['专业设备', 'LED灯'], en: ['Professional', 'LED light'] },
      },
    },
    {
      id: 'low_light_l3_002',
      problemType: 'low_light',
      level: 3,
      scenario: ['portrait', 'video'],
      text: {
        zh: '使用环形灯或柔光箱组合布光',
        en: 'Use ring light or softbox combination lighting',
      },
      params: {
        position: {
          description: { zh: '多角度布光', en: 'Multi-angle lighting' },
          angle: null,
          distance: { zh: '0.5-2米', en: '0.5-2m' },
        },
        action: {
          description: { zh: '组合布光', en: 'Combination lighting' },
          steps: {
            zh: ['设置主光源（环形灯或柔光箱）', '添加辅光源填充阴影', '调整各光源亮度比例'],
            en: [
              'Set up main light (ring light or softbox)',
              'Add fill light for shadows',
              'Adjust brightness ratio of each light',
            ],
          },
        },
        intensity: 0.9,
      },
      conditions: {
        indoor: true,
        outdoor: false,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'hard',
        cost: 'high',
        effectiveness: 0.98,
        tags: { zh: ['专业设备', '多灯布光'], en: ['Professional', 'Multi-light setup'] },
      },
    },
  ],

  good: [
    {
      id: 'good_001',
      problemType: 'good',
      level: 1,
      scenario: ['selfie', 'portrait', 'video'],
      text: {
        zh: '当前光线条件良好，继续保持！',
        en: 'Current lighting is good, keep it up!',
      },
      params: null,
      conditions: {
        indoor: true,
        outdoor: true,
        daytime: true,
        nighttime: true,
      },
      metadata: {
        difficulty: 'easy',
        cost: 'free',
        effectiveness: 1.0,
        tags: { zh: ['无需调整'], en: ['No adjustment needed'] },
      },
    },
  ],
};

export default suggestionDatabase;
