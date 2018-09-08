<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20180908093546_Create_Products_table extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE TABLE products (
                              id UUID NOT NULL,
                              sku VARCHAR(255) NOT NULL,
                              price NUMERIC(10, 4) NOT NULL,
                              name VARCHAR(255) NOT NULL,
                              description TEXT DEFAULT NULL,
                              PRIMARY KEY(id))
        ');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_B3BA5A5AF9038C4 ON products (sku)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP TABLE products');
    }
}
