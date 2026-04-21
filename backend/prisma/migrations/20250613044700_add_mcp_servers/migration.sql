-- Add mcpServers field to UserPreference table
ALTER TABLE `user_preferences` ADD COLUMN `mcp_servers` JSON NULL;
