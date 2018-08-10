pipeline {
    agent {
        dockerfile { filename 'Dockerfile.jenkins' }
    }
    environment {
        HOME = pwd()
        GH_TOKEN = credential('GH_TOKEN')
    }
    stages {
        stage('Prepare') {
            steps {
                sh 'echo HOME=$HOME'
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Package') {
            steps {
                sh 'npm run package'
            }
        }
    }
}
