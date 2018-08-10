pipeline {
    agent {
        dockerfile { filename 'Dockerfile.jenkins' }
    }
    environment {
        # Provide HOME environment, otherwise npm bails out
        # (... and we're not running as a real user, just some externally provided uid)
        HOME = '/tmp'
    }
    stages {
        stage('Prepare') {
            steps {
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
