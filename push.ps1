# Push helper script for The Ambassadors of Knowledge Website
Write-Host "Pushing website to https://github.com/BURHAN-19/website.git..." -ForegroundColor Cyan
git push -u origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`nIf prompted for credentials, use your GitHub username and Personal Access Token (PAT)." -ForegroundColor Yellow
}
pause
