import { RobotPart, PartCategory } from '../types/index.js';

export const robotParts: RobotPart[] = [
  {
    id: 'main_cpu',
    name: 'Main CPU',
    description: 'The central processing unit that runs all computations, AI inference, and coordinates subsystem communication.',
    keywords: ['brain', 'processor', 'computer', 'cpu', 'compute', 'thinking', 'intelligence', 'processing'],
    category: 'control',
  },
  {
    id: 'motor_controller',
    name: 'Motor Speed Controller',
    description: 'Controls the speed and direction of the drive motors. Receives commands from the CPU and translates them into motor signals.',
    keywords: ['speed', 'motor', 'drive', 'movement', 'velocity', 'direction', 'esc', 'controller'],
    category: 'motion',
  },
  {
    id: 'left_wheel',
    name: 'Left Wheel Assembly',
    description: 'Left drive wheel with integrated encoder for odometry. Provides locomotion and turning capability.',
    keywords: ['wheel', 'left', 'tire', 'drive', 'locomotion', 'rolling', 'movement'],
    category: 'motion',
  },
  {
    id: 'right_wheel',
    name: 'Right Wheel Assembly',
    description: 'Right drive wheel with integrated encoder for odometry. Provides locomotion and turning capability.',
    keywords: ['wheel', 'right', 'tire', 'drive', 'locomotion', 'rolling', 'movement'],
    category: 'motion',
  },
  {
    id: 'camera_front',
    name: 'Front Camera',
    description: 'Forward-facing RGB camera for visual perception, object detection, and navigation.',
    keywords: ['camera', 'vision', 'see', 'visual', 'image', 'front', 'eye', 'detect', 'recognition'],
    category: 'sensors',
  },
  {
    id: 'lidar_sensor',
    name: 'LiDAR Scanner',
    description: '360-degree LiDAR sensor for mapping the environment, obstacle detection, and SLAM navigation.',
    keywords: ['lidar', 'laser', 'scan', 'mapping', 'distance', 'obstacle', 'slam', 'navigation', 'range'],
    category: 'sensors',
  },
  {
    id: 'ultrasonic_sensor',
    name: 'Ultrasonic Proximity Sensor',
    description: 'Short-range ultrasonic sensor for close-proximity obstacle detection and collision avoidance.',
    keywords: ['ultrasonic', 'proximity', 'close', 'collision', 'avoidance', 'sonar', 'distance'],
    category: 'sensors',
  },
  {
    id: 'imu_sensor',
    name: 'IMU (Inertial Measurement Unit)',
    description: 'Accelerometer and gyroscope combo for measuring orientation, tilt, and acceleration.',
    keywords: ['imu', 'gyroscope', 'accelerometer', 'orientation', 'tilt', 'balance', 'inertial'],
    category: 'sensors',
  },
  {
    id: 'main_battery',
    name: 'Main Battery Pack',
    description: 'Lithium polymer battery pack providing power to all systems. Includes charge management circuitry.',
    keywords: ['battery', 'power', 'energy', 'charge', 'lipo', 'electricity', 'supply'],
    category: 'power',
  },
  {
    id: 'power_distribution',
    name: 'Power Distribution Board',
    description: 'Distributes power from the battery to all subsystems with voltage regulation and overcurrent protection.',
    keywords: ['power', 'distribution', 'voltage', 'regulator', 'pdb', 'electrical'],
    category: 'power',
  },
  {
    id: 'wifi_module',
    name: 'WiFi Communication Module',
    description: 'Wireless networking module for remote control, telemetry streaming, and cloud connectivity.',
    keywords: ['wifi', 'wireless', 'communication', 'network', 'internet', 'remote', 'telemetry', 'radio'],
    category: 'communication',
  },
  {
    id: 'antenna',
    name: 'Communication Antenna',
    description: 'External antenna for extended wireless range and reliable signal transmission.',
    keywords: ['antenna', 'signal', 'range', 'transmission', 'wireless', 'radio'],
    category: 'communication',
  },
  {
    id: 'chassis',
    name: 'Main Chassis Frame',
    description: 'The structural frame that holds all components together. Made from aluminum for strength and light weight.',
    keywords: ['chassis', 'frame', 'body', 'structure', 'base', 'skeleton', 'housing'],
    category: 'structure',
  },
  {
    id: 'top_cover',
    name: 'Top Protective Cover',
    description: 'Protective cover shielding internal electronics from dust, debris, and minor impacts.',
    keywords: ['cover', 'top', 'shell', 'protection', 'housing', 'shield', 'lid'],
    category: 'structure',
  },
  {
    id: 'servo_arm',
    name: 'Servo Arm Actuator',
    description: 'Articulated servo arm for manipulating objects, pressing buttons, or interacting with the environment.',
    keywords: ['arm', 'servo', 'gripper', 'manipulator', 'actuator', 'grab', 'reach', 'hand'],
    category: 'motion',
  },
];

export function getPartById(id: string): RobotPart | undefined {
  return robotParts.find((p) => p.id === id);
}

export function getPartsByCategory(category: PartCategory): RobotPart[] {
  return robotParts.filter((p) => p.category === category);
}

export function getAllPartIds(): string[] {
  return robotParts.map((p) => p.id);
}

export function getPartsListForAI(): string {
  return robotParts
    .map(
      (p) =>
        `- ID: "${p.id}" | Name: ${p.name} | Description: ${p.description} | Keywords: ${p.keywords.join(', ')}`
    )
    .join('\n');
}
