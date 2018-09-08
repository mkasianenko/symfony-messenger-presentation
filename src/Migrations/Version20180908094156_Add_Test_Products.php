<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20180908094156_Add_Test_Products extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        $this->addSql('
            INSERT INTO products (id, sku, price, name, description) VALUES
            (\'30efb606-f936-4377-9540-ca601c11b150\', \'Y570\', 900, \'Y570\', \'Test desc notebook\'),
            (\'6202f4a9-54ab-41d9-bd7b-8ea16c043b83\', \'S3\', 400, \'S3\', \'Test desc tablet\'),
            (\'8b8c7032-f670-438e-98ab-1e7357d22450\', \'INS8\', 751.89, \'notebook\', \'Test desc notebook\'),
            (\'94d9bf3a-9130-4feb-9c05-268186213f36\', \'PAD5\', 600, \'tablet\', \'Test desc tablet\');
        ');
    }

    public function down(Schema $schema) : void
    {
        $this->addSql('
            DELETE FROM products
            WHERE sku IN (\'Y570\', \'S3\', \'INS8\', \'PAD5\')
        ');
    }
}
