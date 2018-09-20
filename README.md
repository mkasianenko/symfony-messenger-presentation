# symfony-messenger-presentation

Small application for demonstration of  
new Symfony messenger component posibilities and usage  
official documentation <https://github.com/symfony/messenger>

You will need package managers installed:

composer: <https://getcomposer.org/download>

yarn: <https://yarnpkg.com/lang/en/docs/install/#debian-stable>



Installation:

// Install PHP dependencies
$> composer install

// ensure db resource is available, and env var for resource added (as example:)
DATABASE_URL=pgsql://postgres@0.0.0.0:5432/db_messenger_presentation?charset=UTF-8&server_version=10.5

// Execute create database and migrations:migrate commands
$> ./bin/console d:d:c
$> ./bin/console d:m:m --no-interaction

// Install Javascript dependencies and build js-bundle
$> yarn install
$> yarn encore dev

// ensure RabbitMQ resource is available at
MESSENGER_TRANSPORT_DSN=amqp://guest:guest@localhost:5672/%2f/messages

// Run server
$> ./bin/console s:r 0.0.0.0:3001