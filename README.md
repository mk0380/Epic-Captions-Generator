# Automatic Video Caption Generator

Automatically generate captions for short-form videos using ffmpeg and AWS S3, allowing customizable caption settings and high-quality video output.

## Features

- **Automatic Caption Generation:** Utilizes ffmpeg and AWS S3 to generate captions for short videos automatically.
- **Customizable Captions:** Users can change captions as needed, including text and color.
- **High-Quality Video Output:** Ensures no drop in video quality during the captioning process.
- **Easy Integration:** Simple to integrate into existing workflows for video production.
- **Flexible Deployment:** Can be deployed on various platforms with minimal configuration.

## Technology Stack

- **Frontend**: Next.js@14.2.3
- **Backend**: Node.js@20.14.0 with Express

  
## Usage

### Prerequisites

- Install ffmpeg on your system.
- Set up AWS S3 credentials for storage and retrieval of video files.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mk0380/Epic-Captions-Generator.git
   cd Epic-Captions-Generator
2. **Create Environment Variables File (.env) file, with the help of .env.example**
3. **Install Dependencies**
   ```bash
   npm install
4. **Running the Application**
   ```bash
   npm run dev

### Steps (Docker)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mk0380/Epic-Captions-Generator.git
   cd Epic-Captions-Generator
2. **Fill the appropriate Environment Variables in the docker-compose.yml->environment file, with the help of .env.example**
3. **Run**
   ```bash
   docker-compose up

### Support
  If you encounter any issues or have any questions, contact the project maintainer at [mayankkr21@iitk.ac.in].
