CREATE TABLE `wp_site` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `domain` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `wp_site` (`id`, `domain`, `path`) VALUES (1, 'thisdomain.com', '/');
