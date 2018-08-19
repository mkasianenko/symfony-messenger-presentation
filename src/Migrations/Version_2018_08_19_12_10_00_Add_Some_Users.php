<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version_2018_08_19_12_10_00_Add_Some_Users extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        $this->addSql('
            INSERT INTO users (email, password) VALUES
            (\'admin@ggmail.com\', \'admin\'),
            (\'customer@ggmail.com\', \'customer\'),
            (\'user@ggmail.com\', \'user\');
        ');
    }

    public function down(Schema $schema) : void
    {
        $this->addSql('
            DELETE FROM users
            WHERE email IN (\'admin@ggmail.com\', \'customer@ggmail.com\', \'user@ggmail.com\')
        ');
    }
}
